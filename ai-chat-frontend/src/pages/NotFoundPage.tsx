import React from 'react';

const NotFoundPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full py-20 text-center">
    <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
    <p className="text-lg text-gray-400 mb-6">Страница не найдена</p>
    <a href="/" className="text-primary underline">На главную</a>
  </div>
);

export default NotFoundPage;
