import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

export default {
  install(app) {
    // Use Vite's import.meta.glob to import all .vue files in the `@/components/base` directory
    const components = import.meta.glob('@/components/base/*.vue');

    for (const path in components) {
      components[path]().then((componentModule) => {
        // Get the component's name in PascalCase
        const fileName = path.split('/').pop().replace(/\.\w+$/, '');
        const componentName = upperFirst(camelCase(fileName));

        // Register the component globally
        app.component(`Base${componentName}`, componentModule.default);
      });
    }
  },
};