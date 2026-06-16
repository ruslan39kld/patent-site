import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F8F9FA] px-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-[#1B3F7A] mb-4">404</h1>
        <p className="text-xl text-[#6B7280] mb-8">Страница не найдена или еще не создана.</p>
        <Link to="/" className="inline-flex bg-[#C8A028] text-white px-8 py-3 rounded-lg font-bold">
          На главную
        </Link>
      </div>
    </div>
  );
}
