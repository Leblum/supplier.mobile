// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    IdentityAPIBase: 'https://dev.identity.leblum.io/api',
    //IdentityAPIBase: 'http://10.173.114.128:8080/api',
    V1: '/v1',
    ProductAPIBase: 'https://dev.product.leblum.io/api',
    };
  