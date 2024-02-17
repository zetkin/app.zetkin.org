// This test suite is used when developing the rule. Execute by simply running
// `node ./eslint-local-rules/sort-imports.bdd.js` in the terminal.
// These tests should not be made part of the regular unit test suite.

const rule = require('./sort-imports.rule');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('The sort-imports rule', rule, {
  valid: [
    {
      // OK since only 3rd party imports
      code: `
import { useState } from 'react';
`,
    },
    {
      // OK since only local imports
      code: `
    import { someUtil } from 'utils/foo';
    import x from './bar';
    `,
    },
    {
      // OK since imports in correct order with blank line
      code: `
    import { useState } from 'react';

    import { someUtil } from 'utils/foo';
    import x from './bar';
    `,
    },
  ],
  invalid: [
    // Illegal since mix in code
    {
      code: `
import { useState } from 'react';
const x = 2
import { store } from '@reduxjs/toolkit';
      `,
      errors: [
        {
          message: "Don't mix code between imports",
        },
      ],
    },

    // Illegal since 3rd - local - 3rd
    {
      code: `
// Random comment
import { useState } from 'react';
import { someUtil } from 'utils/foo';
import { store } from '@reduxjs/toolkit';

const y = x.bar;
      `,
      output: `
// Random comment
import { useState } from 'react';
import { store } from '@reduxjs/toolkit';

import { someUtil } from 'utils/foo';

const y = x.bar;
      `,
      errors: [
        {
          message: "Don't do 3rd party imports after local imports",
        },
      ],
    },

    // Illegal since 3rd - local - 3rd (with line)
    {
      code: `
// Random comment 5
import { useState } from 'react';

import { someUtil } from 'utils/foo';
import { store } from '@reduxjs/toolkit';

const y = x.bar;
      `,
      output: `
// Random comment 5
import { useState } from 'react';
import { store } from '@reduxjs/toolkit';

import { someUtil } from 'utils/foo';

const y = x.bar;
      `,
      errors: [
        {
          message: "Don't do 3rd party imports after local imports",
        },
      ],
    },

    // Illegal since local - 3rd
    {
      code: `
// Random comment
import { someUtil } from 'utils/foo';
import { store } from '@reduxjs/toolkit';

const y = x.bar;
      `,
      output: `
// Random comment
import { store } from '@reduxjs/toolkit';

import { someUtil } from 'utils/foo';

const y = x.bar;
      `,
      errors: [
        {
          message: "Don't do 3rd party imports after local imports",
        },
      ],
    },

    // Illegal since local - 3rd (but with line)
    {
      code: `
// Random comment
import { someUtil } from 'utils/foo';

import { store } from '@reduxjs/toolkit';

const y = x.bar;
      `,
      output: `
// Random comment
import { store } from '@reduxjs/toolkit';

import { someUtil } from 'utils/foo';

const y = x.bar;
      `,
      errors: [
        {
          message: "Don't do 3rd party imports after local imports",
        },
      ],
    },

    //Illegal since no blank line
    {
      code: `
// Random comment
import { useState } from 'react';
import { someUtil } from 'utils/foo';
import x from './bar';

const y = x.bar;
      `,
      output: `
// Random comment
import { useState } from 'react';

import { someUtil } from 'utils/foo';
import x from './bar';

const y = x.bar;
      `,
      errors: [
        {
          message: 'No blank line between 3rd party imports and local imports',
        },
      ],
    },
  ],
});
