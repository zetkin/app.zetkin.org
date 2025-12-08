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
  paramsType?: string;
  resultType?: string;
  fileLocation: string;
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

    const path = this.extractPathString(pathArg);
    if (!path) {
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
    const relativeFile = sourceFile.fileName
      .replace(this.rootDir, '')
      .replace(/^[\\\/]/, '');

    const pathParams = this.extractPathParams(path);
    const queryParams = this.extractQueryParams(path);

    const endpoint: ApiEndpoint = {
      method: methodName.toUpperCase() as ApiEndpoint['method'],
      path,
      responseType,
      requestType,
      fileLocation: relativeFile,
      lineNumber: line + 1,
      pathParams,
      queryParams,
    };

    const normalizedPath = this.normalizePath(path);

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

    const relativeFile = sourceFile.fileName
      .replace(this.rootDir, '')
      .replace(/^[\\\/]/, '');

    if (!relativeFile.includes('/rpc/') && !relativeFile.includes('\\rpc\\')) {
      return;
    }

    const rpcName = name.replace('Def', '');

    this.rpcEndpoints.push({
      name: rpcName,
      fileLocation: relativeFile,
    });
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

  private extractPathParams(path: string): string[] {
    const matches = path.match(/\{([^}]+)\}/g);
    if (!matches) {
      return [];
    }
    return matches.map((m) => m.slice(1, -1));
  }

  private extractQueryParams(path: string): string[] {
    const queryIndex = path.indexOf('?');
    if (queryIndex === -1) {
      return [];
    }

    const queryString = path.slice(queryIndex + 1);
    const params = queryString.split('&');

    return params
      .map((p) => p.split('=')[0])
      .filter((p) => !p.includes('%3E') && !p.includes('%3C'));
  }

  private normalizePath(path: string): string {
    const queryIndex = path.indexOf('?');
    if (queryIndex !== -1) {
      path = path.slice(0, queryIndex);
    }

    return path;
  }

  private typeToString(type: ts.TypeNode, sourceFile?: ts.SourceFile): string {
    return type.getText(sourceFile);
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

      for (const endpoint of endpoints) {
        const operation: any = {
          summary: this.generateSummary(endpoint),
          description: `Source: ${endpoint.fileLocation}:${endpoint.lineNumber}`,
          tags: this.extractTags(endpoint.path),
        };

        const parameters: any[] = [];

        for (const param of endpoint.pathParams) {
          parameters.push({
            name: param,
            in: 'path',
            required: true,
            schema: {
              type: this.guessParamType(param),
              example: this.getExampleValue(param),
            },
          });
        }

        for (const param of endpoint.queryParams) {
          parameters.push({
            name: param,
            in: 'query',
            required: false,
            schema: { type: 'string' },
          });
        }

        if (parameters.length > 0) {
          operation.parameters = parameters;
        }

        if (
          ['POST', 'PATCH', 'PUT'].includes(endpoint.method) &&
          endpoint.requestType
        ) {
          operation.requestBody = {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${endpoint.requestType}`,
                },
              },
            },
          };
        }

        operation.responses = {
          200: {
            description: 'Successful response',
            content: endpoint.responseType
              ? {
                  'application/json': {
                    schema: {
                      $ref: `#/components/schemas/${endpoint.responseType}`,
                    },
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

        pathItem[endpoint.method.toLowerCase()] = operation;
      }

      paths[pathKey] = pathItem;
    }

    if (this.rpcEndpoints.length > 0) {
      paths['/api/rpc'] = {
        post: {
          summary: 'Remote Procedure Call endpoint',
          description: 'Execute registered RPC functions',
          tags: ['RPC'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    func: {
                      type: 'string',
                      enum: this.rpcEndpoints.map((rpc) => rpc.name),
                    },
                    params: {
                      type: 'object',
                    },
                  },
                  required: ['func', 'params'],
                },
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
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
    }

    const openapi = {
      openapi: '3.0.0',
      info: {
        title: 'Zetkin App API',
        version: '1.0.0',
        description:
          'Auto-generated API documentation from the https://github.com/zetkin/app.zetkin.org repo',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: '',
          description: 'Production server',
        },
      ],
      paths,
      components: {
        schemas: {},
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'zsid',
            description:
              'Session cookie (zsid). Log in at the app to get this cookie.',
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
    const parts = path.split('/').filter((p) => p && !p.startsWith('{'));
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
    const parts = path.split('/').filter((p) => p && !p.startsWith('{'));
    const relevantParts = parts.filter((p) => p !== 'api' && p !== 'orgs');

    if (relevantParts.length === 0) {
      return ['General'];
    }

    return [this.capitalizeFirst(relevantParts[0])];
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

    return Array.from(tagSet)
      .sort()
      .map((tag) => ({
        name: tag,
        description: `${tag} related endpoints`,
      }));
  }

  private guessParamType(paramName: string): string {
    if (paramName.toLowerCase().includes('id')) {
      return 'integer';
    }
    return 'string';
  }

  private getExampleValue(paramName: string): string | number {
    const exampleValues: Record<string, string | number> = {
      orgId: 2,
      personId: 2,
      userId: 2,
      campId: 1,
      projId: 1,
      campaignId: 1,
      projectId: 1,
      eventId: 1,
      surveyId: 1,
      taskId: 1,
      viewId: 1,
      emailId: 1,
      callId: 1,
      canvassId: 1,
      assignmentId: 1,
      callAssId: 1,
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

    const lowerParam = paramName.toLowerCase();

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
      : path.join(process.cwd(), 'openapi.json');

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
