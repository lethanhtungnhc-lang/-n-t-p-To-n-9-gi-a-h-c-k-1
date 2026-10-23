import React, { useEffect, useState } from 'react';
import { Download, WifiOff, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {/* Offline Alert Toast */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 text-slate-950 font-bold px-3 py-2 text-xs shadow-xl backdrop-blur-xs">
          <WifiOff size={15} />
          <span>Đang ở chế độ Ngoại tuyến (Offline PWA) - Dữ liệu đã được lưu trữ</span>
        </div>
      )}

      {/* Floating Install App Button if not yet installed */}
      {!isInstalled && (deferredPrompt || isIOS) && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 border border-cyan-400/40 transition-all hover:scale-105"
            title="Cài đặt game về màn hình chính điện thoại / máy tính"
          >
            <Download size={14} />
            <span>Cài App Toán 9</span>
          </button>
        </div>
      )}

      {/* iOS Installation Instruction Guide */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm">
                <Smartphone size={18} />
                <span>Thêm vào Màn hình chính (iOS)</span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Mở trang web bằng trình duyệt <strong>Safari</strong> trên iPhone/iPad.
              </li>
              <li>
                Nhấn vào nút <strong>Chia sẻ (Share)</strong> hình ô vuông có mũi tên trỏ lên ở thanh công cụ dưới cùng.
              </li>
              <li>
                Cuộn xuống và chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.
              </li>
              <li>
                Nhấn <strong>Thêm (Add)</strong> ở góc trên bên phải để bắt đầu chơi mượt mà như một ứng dụng độc lập!
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
