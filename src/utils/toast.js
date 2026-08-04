export const toast = {
  success: (message) => showToast(message, 'success'),
  error: (message) => showToast(message, 'error')
};

const showToast = (message, type) => {
  const div = document.createElement('div');
  div.className = `fixed bottom-4 right-4 z-[9999] px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-all duration-300 transform translate-y-full opacity-0 flex items-center gap-2 ${
    type === 'success' ? 'bg-green-500/90 border border-green-500/50' : 'bg-red-500/90 border border-red-500/50'
  }`;
  
  div.innerHTML = `
    ${type === 'success' 
      ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
    }
    <span>${message}</span>
  `;
  document.body.appendChild(div);
  
  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      div.style.transform = 'translateY(0)';
      div.style.opacity = '1';
    });
  });

  // Animate out
  setTimeout(() => {
    div.style.transform = 'translateY(100%)';
    div.style.opacity = '0';
    setTimeout(() => document.body.removeChild(div), 300);
  }, 3000);
};
