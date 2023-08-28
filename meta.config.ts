export default [
    {
        name: 're-gen',
        entry: './packages/shared/re-gen/src',
        mode: 'lib',
        bundleName: 're-gen',
        moduleName: 'ReGen'
    },
    {
        name: 're-utils',
        entry: './packages/shared/re-utils/src',
        mode: 'lib',
        bundleName: 're-utils',
        moduleName: 'ReUtils'
    },
    {
        name: 're-hooks',
        entry: './packages/shared/re-hooks/src',
        mode: 'lib',
        bundleName: 're-hooks',
        moduleName: 'ReHooks'
    },
    {
        name: 're-form-filter',
        entry: './packages/components/re-form-filter/src',
        mode: 'component',
        bundleName: 're-form-filter',
        moduleName: 'ReFormFilter'
    },
    {
        name: 're-form-field',
        entry: './packages/components/re-form-field/src',
        mode: 'component',
        bundleName: 're-form-field',
        moduleName: 'ReFormField'
    },
    {
        name: 're-backend',
        entry: './packages/projects/re-backend/src',
        mode: 'project',
        bundleName: 're-backend',
        moduleName: 'ReGen'
    }
];
