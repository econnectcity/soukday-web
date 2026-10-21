import React from 'react';

const Loader = ({ background, height, width, screen }) => {
  const isFullScreen = screen === 'full';

  const spinnerContent = (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Outer subtle ring track */}
      <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-stone-200/40 dark:border-stone-800"></div>

      {/* Main rotating orange spinner ring around the favicon */}
      <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-[#FF7A45] border-r-[#FF7A45] animate-spin"></div>

      {/* Inner subtle reverse rotating dashed ring */}
      <div
        className="absolute inset-1.5 w-[84px] h-[84px] rounded-full border-2 border-dashed border-[#FF7A45]/30 animate-spin"
        style={{ animationDirection: 'reverse', animationDuration: '4s' }}
      ></div>

      {/* Centered Favicon Image */}
      <div className="relative z-10 w-12 h-12 rounded-full overflow-hidden shadow-md ring-2 ring-white/90 bg-[#F48B60] flex items-center justify-center select-none pointer-events-none">
        <img
          src="/favicon.png"
          alt="Soukday Loading"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );

  if (isFullScreen) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        style={{ background: background === 'none' ? 'transparent' : undefined }}
      >
        <div className="flex flex-col items-center justify-center p-6 bg-white/95 dark:bg-stone-900/95 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-800 animate-scale-up">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center py-6"
      style={{
        width: width || '100%',
        height: height || 'auto',
        background: background || 'transparent',
      }}
    >
      <div className="flex items-center justify-center p-4">
        {spinnerContent}
      </div>
    </div>
  );
};

export default Loader;
