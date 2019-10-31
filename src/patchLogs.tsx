import { setConfig } from 'react-hot-loader';

export const patchLogs = () => {
  // не выводить всякую мишуру из RHL, вроде той,
  // что пишется при багованной реконсиляции
  setConfig({ logLevel: 'no-errors-please' });

  const errorOriginal = console.error;
  console.error = (...args) => {
    const data = args.map(a => a.toString()).join(' ');

    // Связка RHL + React Router выкидывает ошибку о том,
    // что объект роутера менять нельзя. Глубоко во всё это не
    // погружался, но пишут, что это можно игонировать, и предлагают
    // запатчить console.error.
    //
    // https://github.com/gaearon/react-hot-loader/issues/298
    // https://github.com/gaearon/react-hot-loader/issues/454
    if (data.includes('You cannot change <Router')) {
      return;
    }

    // нормальная ошибка
    errorOriginal.apply(console, args);
  };
};
