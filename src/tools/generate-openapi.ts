#!/usr/bin/env ts-node

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  responseType?: string;
  requestType?: string;
  fileLocation: string;
  lineNumber: number;
  pathParams: string[];
  queryParams: string[];
}

interface RpcEndpoint {
  name: string;
  paramsSchema?: any;
  resultType?: string;
  fileLocation: string;
  lineNumber: number;
}

class OpenApiGenerator {
  private endpoints: Map<string, ApiEndpoint[]> = new Map();
  private rpcEndpoints: RpcEndpoint[] = [];
  private program: ts.Program;

  constructor(private rootDir: string) {
    const configPath = ts.findConfigFile(
      rootDir,
      ts.sys.fileExists,
      'tsconfig.json'
    );
    const configFile = configPath
      ? ts.readConfigFile(configPath, ts.sys.readFile)
      : undefined;

    const compilerOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.React,
      allowJs: true,
      skipLibCheck: true,
      strict: false,
      noEmit: true,
    };

    const files = glob.sync('**/*.{ts,tsx}', {
      cwd: rootDir,
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
      absolute: true,
    });

    this.program = ts.createProgram(files, compilerOptions);
  }

  public async parse(): Promise<void> {
    const sourceFiles = this.program
      .getSourceFiles()
      .filter((sf) => !sf.fileName.includes('node_modules'));

    console.log(`Parsing ${sourceFiles.length} source files...`);

    for (const sourceFile of sourceFiles) {
      this.visitNode(sourceFile, sourceFile);
    }

    console.log(`Found ${this.getTotalEndpoints()} REST endpoints`);
    console.log(`Found ${this.rpcEndpoints.length} RPC endpoints`);
  }

  private visitNode(node: ts.Node, sourceFile: ts.SourceFile): void {
    if (ts.isCallExpression(node)) {
      this.processCallExpression(node, sourceFile);
    }

    if (ts.isVariableDeclaration(node)) {
      this.processRpcDefinition(node, sourceFile);
    }

    ts.forEachChild(node, (child) => this.visitNode(child, sourceFile));
  }

  private processCallExpression(
    node: ts.CallExpression,
    sourceFile: ts.SourceFile
  ): void {
    const expression = node.expression;

    if (!ts.isPropertyAccessExpression(expression)) {
      return;
    }

    const methodName = expression.name.text;
    const httpMethods = ['get', 'post', 'patch', 'put', 'delete'];

    if (!httpMethods.includes(methodName)) {
      return;
    }

    const pathArg = node.arguments[0];
    if (!pathArg) {
      return;
    }

    const endpointPath = this.extractPathString(pathArg);
    if (!endpointPath) {
      return;
    }

    const typeArguments = node.typeArguments;
    const responseType = typeArguments?.[0]
      ? this.typeToString(typeArguments[0], sourceFile)
      : undefined;
    const requestType = typeArguments?.[1]
      ? this.typeToString(typeArguments[1], sourceFile)
      : undefined;

    const { line } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile)
    );
    const relativeFile = path
      .relative(this.rootDir, sourceFile.fileName)
      .replace(/\\/g, '/');

    const pathParams = this.extractPathParams(endpointPath);
    const queryParams = this.extractQueryParams(endpointPath);

    const endpoint: ApiEndpoint = {
      method: methodName.toUpperCase() as ApiEndpoint['method'],
      path: endpointPath,
      responseType,
      requestType,
      fileLocation: relativeFile,
      lineNumber: line + 1,
      pathParams,
      queryParams,
    };

    const normalizedPath = this.normalizePath(endpointPath);

    if (!this.endpoints.has(normalizedPath)) {
      this.endpoints.set(normalizedPath, []);
    }
    this.endpoints.get(normalizedPath)!.push(endpoint);
  }

  private processRpcDefinition(
    node: ts.VariableDeclaration,
    sourceFile: ts.SourceFile
  ): void {
    if (!ts.isIdentifier(node.name)) {
      return;
    }

    const name = node.name.getText(sourceFile);

    if (!name.endsWith('Def')) {
      return;
    }

    const relativeFile = path
      .relative(this.rootDir, sourceFile.fileName)
      .replace(/\\/g, '/');

    if (!relativeFile.includes('/rpc/')) {
      return;
    }

    const { line } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile)
    );

    const rpcName = name.replace('Def', '');

    let paramsSchema: any = undefined;
    let resultType: string | undefined = undefined;

    if (node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      const properties = node.initializer.properties;

      let actualName = rpcName;
      for (const prop of properties) {
        if (
          ts.isPropertyAssignment(prop) &&
          ts.isIdentifier(prop.name) &&
          prop.name.text === 'name' &&
          ts.isStringLiteral(prop.initializer)
        ) {
          actualName = prop.initializer.text;
        }
        if (
          ts.isPropertyAssignment(prop) &&
          ts.isIdentifier(prop.name) &&
          prop.name.text === 'schema'
        ) {
          paramsSchema = this.extractZodSchema(prop.initializer, sourceFile);
        }
      }

      this.rpcEndpoints.push({
        name: actualName,
        paramsSchema,
        resultType,
        fileLocation: relativeFile,
        lineNumber: line + 1,
      });
    }
  }

  private extractZodSchema(node: ts.Node, sourceFile: ts.SourceFile): any {
    if (ts.isIdentifier(node)) {
      const schemaName = node.text;
      const foundSchema = this.findSchemaDefinition(schemaName, sourceFile);
      if (foundSchema) {
        return foundSchema;
      }
    }

    const text = node.getText(sourceFile);

    if (text.includes('z.object')) {
      const properties: Record<string, any> = {};
      const required: string[] = [];

      const objectMatch = text.match(/z\.object\(\{([\s\S]+?)\}\)/);
      if (objectMatch) {
        const propsText = objectMatch[1];
        const propRegex = /(\w+):\s*z\.(\w+)\([^)]*\)/g;
        let match;

        while ((match = propRegex.exec(propsText)) !== null) {
          const [, propName, zodType] = match;
          const openApiType = this.zodTypeToOpenApi(zodType);
          properties[propName] = openApiType;
          required.push(propName);
        }
      }

      return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
      };
    }

    return undefined;
  }

  private findSchemaDefinition(
    schemaName: string,
    sourceFile: ts.SourceFile
  ): any {
    let foundSchema: any = undefined;

    const visit = (node: ts.Node) => {
      if (ts.isVariableStatement(node)) {
        for (const declaration of node.declarationList.declarations) {
          if (
            ts.isIdentifier(declaration.name) &&
            declaration.name.text === schemaName &&
            declaration.initializer
          ) {
            foundSchema = this.extractZodSchema(
              declaration.initializer,
              sourceFile
            );
            return;
          }
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return foundSchema;
  }

  private zodTypeToOpenApi(zodType: string): any {
    const typeMap: Record<string, any> = {
      string: { type: 'string' },
      number: { type: 'number' },
      boolean: { type: 'boolean' },
      date: { type: 'string', format: 'date-time' },
      array: { type: 'array', items: { type: 'string' } },
      object: { type: 'object' },
    };

    return typeMap[zodType] || { type: 'object' };
  }

  private readonly VALID_API_PREFIXES = ['/api', '/api2', '/beta'];

  private extractPathString(node: ts.Node): string | null {
    let path: string | null = null;

    if (ts.isStringLiteral(node)) {
      path = node.text;
    } else if (
      ts.isTemplateExpression(node) ||
      ts.isNoSubstitutionTemplateLiteral(node)
    ) {
      path = this.templateToPath(node);
    }

    if (path && this.isValidApiPath(path)) {
      return path;
    }

    return null;
  }

  private isValidApiPath(path: string): boolean {
    return this.VALID_API_PREFIXES.some((prefix) => path.startsWith(prefix));
  }

  private templateToPath(node: ts.TemplateLiteral): string {
    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      return node.text;
    }

    let result = node.head.text;

    for (const span of (node as ts.TemplateExpression).templateSpans) {
      const expression = span.expression;
      const paramName = this.getParameterName(expression);
      result += `{${paramName}}`;
      result += span.literal.text;
    }

    return result;
  }

  private getParameterName(expression: ts.Expression): string {
    if (ts.isIdentifier(expression)) {
      return expression.text;
    }

    if (ts.isPropertyAccessExpression(expression)) {
      return expression.name.text;
    }

    return 'param';
  }

  private normalizeParamName(paramName: string, pathContext: string): string {
    const lower = paramName.toLowerCase();

    if (lower.includes('org') && !lower.includes('target')) {
      return 'orgId';
    }
    if (lower.includes('campaign')) {
      return 'campId';
    }
    if (lower.includes('event') || lower.includes('action')) {
      return 'eventId';
    }
    if (lower.includes('person')) {
      return 'personId';
    }
    if (lower.includes('survey')) {
      return 'surveyId';
    }
    if (lower.includes('task')) {
      return 'taskId';
    }
    if (lower.includes('call')) {
      return 'callId';
    }
    if (lower.includes('assignment')) {
      return 'assignmentId';
    }
    if (lower.includes('email')) {
      return 'emailId';
    }
    if (lower.includes('view')) {
      return 'viewId';
    }
    if (lower.includes('form')) {
      return 'formId';
    }
    if (lower.includes('file')) {
      return 'fileId';
    }

    if (paramName === 'id' || paramName === 'param') {
      const pathSegments = pathContext.split('/').filter((s) => s);

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];

        if (segment.includes('{') && segment.includes('}')) {
          const placeholder = segment.match(/\{([^}]+)\}/)?.[1];
          if (placeholder === paramName) {
            const prevSegment = i > 0 ? pathSegments[i - 1] : '';

            if (prevSegment === 'orgs') return 'orgId';
            if (prevSegment === 'campaigns') return 'campId';
            if (prevSegment === 'actions' || prevSegment === 'events')
              return 'eventId';
            if (prevSegment === 'people') return 'personId';
            if (
              prevSegment === 'surveys' ||
              prevSegment === 'survey_submissions'
            )
              return 'submissionId';
            if (prevSegment === 'tasks') return 'taskId';
            if (prevSegment === 'call_assignments') return 'assignmentId';
            if (prevSegment === 'emails') return 'emailId';
            if (prevSegment === 'views') return 'viewId';
            if (prevSegment === 'calls') return 'callId';
          }
        }
      }
    }

    return paramName;
  }

  private extractPathParams(path: string): string[] {
    const pathPart = path.split('?')[0];
    const matches = pathPart.match(/\{([^}]+)\}/g);
    if (!matches) {
      return [];
    }
    return matches.map((m) => {
      const paramName = m.slice(1, -1);
      return this.normalizeParamName(paramName, pathPart);
    });
  }

  private extractQueryParams(path: string): string[] {
    const queryIndex = path.indexOf('?');
    if (queryIndex === -1) {
      return [];
    }

    const queryString = path.slice(queryIndex + 1);
    const params = queryString.split('&');

    const paramNames = new Set<string>();

    for (const param of params) {
      let paramName = param.split('=')[0];

      if (paramName.includes('[')) {
        paramName = paramName.split('[')[0];
      }

      if (paramName.startsWith('${') && paramName.endsWith('}')) {
        continue;
      }

      if (paramName.startsWith('${')) {
        paramName = paramName.slice(2);
        if (paramName.endsWith('}')) {
          paramName = paramName.slice(0, -1);
        }
      }

      if (
        !paramName.includes('%3E') &&
        !paramName.includes('%3C') &&
        !paramName.includes('{') &&
        !paramName.includes('}') &&
        !paramName.includes('$') &&
        paramName.length > 0
      ) {
        paramNames.add(paramName);
      }
    }

    return Array.from(paramNames);
  }

  private normalizePath(path: string): string {
    const queryIndex = path.indexOf('?');
    if (queryIndex !== -1) {
      path = path.slice(0, queryIndex);
    }

    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    path = path.replace(/\{([^}]+)\}/g, (_match, paramName) => {
      const normalized = this.normalizeParamName(paramName, path);
      return `{${normalized}}`;
    });

    return path;
  }

  private typeToString(type: ts.TypeNode, sourceFile?: ts.SourceFile): string {
    return type.getText(sourceFile);
  }

  private typeToSchema(typeName: string): any {
    if (typeName.endsWith('[]')) {
      const itemType = typeName.slice(0, -2);
      return {
        type: 'array',
        items: this.typeToSchema(itemType),
      };
    }

    const primitiveMap: Record<string, string> = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      any: 'object',
      unknown: 'object',
      void: 'null',
    };

    if (primitiveMap[typeName]) {
      return { type: primitiveMap[typeName] };
    }

    return {
      type: 'object',
      description: `Type: ${typeName}`,
    };
  }

  private getTotalEndpoints(): number {
    let total = 0;
    for (const endpoints of this.endpoints.values()) {
      total += endpoints.length;
    }
    return total;
  }

  public generateOpenApi(): object {
    const paths: Record<string, any> = {};

    const sortedPaths = Array.from(this.endpoints.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    for (const [pathKey, endpoints] of sortedPaths) {
      const pathItem: any = {};

      const methodGroups = new Map<string, ApiEndpoint[]>();
      for (const endpoint of endpoints) {
        if (!methodGroups.has(endpoint.method)) {
          methodGroups.set(endpoint.method, []);
        }
        methodGroups.get(endpoint.method)!.push(endpoint);
      }

      for (const [method, methodEndpoints] of methodGroups) {
        const canonicalEndpoint = methodEndpoints[0];

        const allQueryParams = new Set<string>();
        for (const endpoint of methodEndpoints) {
          endpoint.queryParams.forEach((p) => allQueryParams.add(p));
        }

        let description = `${canonicalEndpoint.fileLocation}:${canonicalEndpoint.lineNumber}`;

        if (canonicalEndpoint.path.includes('breadcrumbs')) {
          description +=
            '\n\nExample: `GET /api/breadcrumbs?pathname=/organize/[orgId]/projects&orgId=2`';
        }

        const operation: any = {
          summary: this.generateSummary(canonicalEndpoint),
          description,
          tags: this.extractTags(canonicalEndpoint.path),
        };

        const parameters: any[] = [];
        const addedParams = new Set<string>();

        for (const param of canonicalEndpoint.pathParams) {
          if (!addedParams.has(param)) {
            parameters.push({
              name: param,
              in: 'path',
              required: true,
              schema: {
                type: this.guessParamType(param),
                example: this.getExampleValue(param),
              },
            });
            addedParams.add(param);
          }
        }

        for (const param of Array.from(allQueryParams).sort()) {
          if (!addedParams.has(param)) {
            const paramObj: any = {
              name: param,
              in: 'query',
              required: false,
              schema: {
                type: this.guessParamType(param),
                example: this.getExampleValue(param),
              },
            };

            const description = this.getParamDescription(
              param,
              canonicalEndpoint.path
            );
            if (description) {
              paramObj.description = description;
            }

            parameters.push(paramObj);
            addedParams.add(param);
          }
        }

        if (
          canonicalEndpoint.path.includes('breadcrumbs') &&
          !addedParams.has('orgId')
        ) {
          parameters.push({
            name: 'orgId',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
              example: 2,
            },
            description:
              'Organization ID to resolve [orgId] placeholder in pathname',
          });
        }

        if (parameters.length > 0) {
          operation.parameters = parameters;
        }

        if (
          ['POST', 'PATCH', 'PUT'].includes(canonicalEndpoint.method) &&
          canonicalEndpoint.requestType
        ) {
          operation.requestBody = {
            required: true,
            content: {
              'application/json': {
                schema: this.typeToSchema(canonicalEndpoint.requestType),
              },
            },
          };
        } else if (
          ['POST', 'PATCH', 'PUT'].includes(canonicalEndpoint.method)
        ) {
          operation.requestBody = {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          };
        }

        operation.responses = {
          200: {
            description: 'Successful response',
            content: canonicalEndpoint.responseType
              ? {
                  'application/json': {
                    schema: this.typeToSchema(canonicalEndpoint.responseType),
                  },
                }
              : {},
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'Forbidden',
          },
          404: {
            description: 'Not found',
          },
        };

        pathItem[method.toLowerCase()] = operation;
      }

      paths[pathKey] = pathItem;
    }

    if (this.rpcEndpoints.length > 0) {
      const sortedRpcEndpoints = [...this.rpcEndpoints].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      const allFuncNames = sortedRpcEndpoints.map((rpc) => rpc.name);

      const examples: Record<string, any> = {};
      for (const rpc of sortedRpcEndpoints) {
        const exampleParams: any = {};
        if (rpc.paramsSchema?.properties) {
          for (const [key, value] of Object.entries(
            rpc.paramsSchema.properties
          )) {
            const propSchema = value as any;
            if (propSchema.type === 'string') {
              exampleParams[key] = 'string';
            } else if (propSchema.type === 'number') {
              exampleParams[key] = key.toLowerCase().includes('id') ? 1 : 0;
            } else if (propSchema.type === 'boolean') {
              exampleParams[key] = false;
            } else {
              exampleParams[key] = null;
            }
          }
        }

        examples[rpc.name] = {
          summary: `RPC: ${rpc.name}`,
          description: `${rpc.fileLocation}:${rpc.lineNumber}`,
          value: {
            func: rpc.name,
            params: exampleParams,
          },
        };
      }

      paths['/api/rpc'] = {
        post: {
          summary: 'Remote Procedure Call (RPC) Endpoint',
          description:
            'Execute RPC functions. All RPC calls use this single endpoint with the function name in the `func` parameter.',
          tags: ['RPC'],
          operationId: 'rpc',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    func: {
                      type: 'string',
                      enum: allFuncNames,
                      description: 'RPC function name to execute',
                    },
                    params: {
                      type: 'object',
                      description:
                        'Function parameters (see examples for each function)',
                    },
                  },
                  required: ['func', 'params'],
                },
                examples,
              },
            },
          },
          responses: {
            200: {
              description: 'RPC call successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      result: {
                        type: 'object',
                        description:
                          'Result object (structure varies by function)',
                      },
                    },
                    required: ['result'],
                  },
                },
              },
            },
            400: {
              description: 'Bad request - invalid parameters',
            },
            404: {
              description: 'RPC function not found',
            },
          },
        },
      };
    }

    const openapi = {
      openapi: '3.0.0',
      info: {
        title: 'Zetkin APIs',
        version: '1.0.0',
        description:
          'Auto-generated API documentation from the https://github.com/zetkin/app.zetkin.org repo',
      },
      paths,
      components: {
        schemas: {},
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'zsid',
            description:
              'Session cookie (zsid). To get this:\n' +
              '1. Log in at http://localhost:3000\n' +
              '2. Open DevTools (F12) > Application/Storage > Cookies\n' +
              '3. Copy the zsid cookie value\n' +
              '4. Paste it in the Value field below',
          },
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
      tags: this.generateTags(),
    };

    return openapi;
  }

  private generateSummary(endpoint: ApiEndpoint): string {
    const resource = this.extractResourceName(endpoint.path);
    const action = this.getActionFromMethod(endpoint.method);

    return `${action} ${resource}`;
  }

  private extractResourceName(path: string): string {
    const cleanPath = this.normalizePath(path);
    const parts = cleanPath.split('/').filter((p) => p && !p.startsWith('{'));
    const resourcePart = parts[parts.length - 1];

    if (!resourcePart || resourcePart === 'api') {
      return 'resource';
    }

    return resourcePart.charAt(0).toUpperCase() + resourcePart.slice(1);
  }

  private getActionFromMethod(method: string): string {
    const actions: Record<string, string> = {
      GET: 'Get',
      POST: 'Create',
      PATCH: 'Update',
      PUT: 'Replace',
      DELETE: 'Delete',
    };
    return actions[method] || method;
  }

  private extractTags(path: string): string[] {
    const cleanPath = this.normalizePath(path);
    const parts = cleanPath.split('/').filter((p) => p && !p.startsWith('{'));

    let apiTag = '';
    if (cleanPath.startsWith('/api2/')) {
      apiTag = 'api2';
    } else if (cleanPath.startsWith('/beta/')) {
      apiTag = 'beta';
    } else if (cleanPath.startsWith('/api/')) {
      apiTag = 'api';
    }

    return apiTag ? [apiTag] : ['General'];
  }

  private generateTags(): Array<{ name: string; description: string }> {
    const tagSet = new Set<string>();

    for (const endpoints of this.endpoints.values()) {
      for (const endpoint of endpoints) {
        const tags = this.extractTags(endpoint.path);
        tags.forEach((tag) => tagSet.add(tag));
      }
    }

    if (this.rpcEndpoints.length > 0) {
      tagSet.add('RPC');
    }

    const tagDescriptions: Record<string, string> = {
      api: 'API endpoints',
      api2: 'API2 endpoints',
      beta: 'Beta/experimental endpoints',
      RPC: 'Remote Procedure Call endpoints',
      General: 'General endpoints',
    };

    const sortedTags = Array.from(tagSet).sort((a, b) => {
      const order = ['api', 'api2', 'beta', 'RPC', 'General'];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });

    return sortedTags.map((tag) => ({
      name: tag,
      description: tagDescriptions[tag] || `${tag} related endpoints`,
    }));
  }

  private guessParamType(paramName: string): string {
    if (paramName.toLowerCase().includes('id')) {
      return 'integer';
    }
    return 'string';
  }

  private getParamDescription(
    paramName: string,
    path: string
  ): string | undefined {
    const lower = paramName.toLowerCase();

    if (lower === 'pathname' && path.includes('breadcrumbs')) {
      return 'Route pathname with placeholders like /organize/[orgId]/projects. Pass placeholder values as separate query params (e.g., add &orgId=2 to the URL).';
    }
    if (lower === 'query' && path.includes('breadcrumbs')) {
      return 'Query parameters for the pathname (e.g., orgId=2)';
    }
    if (lower === 'filter' && path.includes('actions')) {
      return 'Filter expression to query events. Format: field>=value or field<=value. Example: start_time>=2025-12-11T10:00:00 filters events starting after that time.';
    }
    if (lower === 'recursive' && path.includes('actions')) {
      return 'Include events from sub-organizations. Set to any value (e.g., "1") or omit parameter entirely. Presence of parameter = recursive, absence = non-recursive.';
    }

    return undefined;
  }

  private getExampleValue(paramName: string): string | number {
    const lowerParam = paramName.toLowerCase();

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    if (
      lowerParam === 'today' ||
      lowerParam === 'date' ||
      lowerParam === 'startdate' ||
      lowerParam === 'enddate' ||
      lowerParam === 'from' ||
      lowerParam === 'to' ||
      lowerParam === 'after' ||
      lowerParam === 'before' ||
      lowerParam.includes('date')
    ) {
      return dateStr;
    }

    if (lowerParam === 'pathname') {
      return '/organize/[orgId]/projects';
    }
    if (lowerParam === 'query') {
      return 'orgId=2';
    }
    if (lowerParam === 'filter') {
      return `start_time>=${dateStr}T00:00:00`;
    }
    if (lowerParam === 'recursive') {
      return 1;
    }

    const exampleValues: Record<string, string | number> = {
      orgId: 2,
      personId: 2,
      userId: 2,
      campId: 1,
      projId: 1,
      campaignId: 281,
      projectId: 281,
      eventId: 544,
      surveyId: 170,
      taskId: 1,
      viewId: 1,
      emailId: 1,
      callId: 1,
      canvassId: 1,
      assignmentId: 73,
      callAssId: 145,
      canvassAssId: 1,
      areaId: 1,
      areaAssId: 1,
      locationId: 1,
      householdId: 1,
      submissionId: 1,
      folderId: 1,
      columnId: 1,
      tagId: 1,
      groupId: 1,
      roleId: 1,
      fileId: 1,
      journeyId: 1,
      instanceId: 1,
      milestoneId: 1,
    };

    for (const [key, value] of Object.entries(exampleValues)) {
      if (lowerParam === key.toLowerCase()) {
        return value;
      }
    }

    if (paramName.toLowerCase().includes('id')) {
      return 1;
    }

    return 'example';
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public saveToFile(outputPath: string): void {
    const spec = this.generateOpenApi();
    const content = JSON.stringify(spec, null, 2);

    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log(`\nOpenAPI specification saved to: ${outputPath}`);
  }

  public printStats(): void {
    console.log('\n=== OpenAPI Generation Statistics ===');
    console.log(`Total REST endpoints: ${this.getTotalEndpoints()}`);
    console.log(`Unique paths: ${this.endpoints.size}`);
    console.log(`RPC endpoints: ${this.rpcEndpoints.length}`);

    const methodCounts: Record<string, number> = {};
    for (const endpoints of this.endpoints.values()) {
      for (const endpoint of endpoints) {
        methodCounts[endpoint.method] =
          (methodCounts[endpoint.method] || 0) + 1;
      }
    }

    console.log('\nEndpoints by HTTP method:');
    for (const [method, count] of Object.entries(methodCounts).sort()) {
      console.log(`  ${method}: ${count}`);
    }

    console.log('\nTop 10 most used paths:');
    const sortedPaths = Array.from(this.endpoints.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10);

    for (const [path, endpoints] of sortedPaths) {
      console.log(`  ${path}: ${endpoints.length} calls`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const outputPath =
    outputIndex !== -1 && args[outputIndex + 1]
      ? args[outputIndex + 1]
      : path.join(process.cwd(), 'public/openapi/openapi.json');

  console.log('Zetkin OpenAPI Generator\n');
  console.log(`Root directory: ${process.cwd()}`);
  console.log(`Output file: ${outputPath}\n`);

  const generator = new OpenApiGenerator(process.cwd());

  await generator.parse();
  generator.printStats();
  generator.saveToFile(outputPath);

  console.log('\n Done! You can now:');
  console.log('  1. View the spec in Swagger UI: https://editor.swagger.io/');
  console.log('  2. Import into Postman');
  console.log('  3. Generate client SDKs using openapi-generator');
}

main().catch(console.error);
