const PHONE = '918920494684';
const MESSAGE = "Hi, I'm interested in Quad Cabins";

export default function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      className="fixed right-[26px] bottom-[92px] z-40 w-[52px] h-[52px] max-[480px]:right-[16px] max-[480px]:bottom-[82px] max-[480px]:w-[48px] max-[480px]:h-[48px] rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform duration-200 ease-in-out shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:scale-[1.08] hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)]"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.001 3C9.373 3 4 8.373 4 15.001c0 2.386.628 4.68 1.822 6.693L4 29l7.485-1.795A11.94 11.94 0 0 0 16.001 27C22.63 27 28 21.63 28 15.001 28 8.373 22.63 3 16.001 3zm0 21.818a9.77 9.77 0 0 1-4.98-1.362l-.357-.212-4.44 1.065 1.09-4.328-.233-.372a9.77 9.77 0 0 1-1.5-5.209c0-5.4 4.395-9.796 9.798-9.796 5.4 0 9.796 4.396 9.796 9.796 0 5.401-4.395 9.796-9.796 9.796zm5.373-7.34c-.294-.148-1.741-.859-2.01-.957-.27-.098-.467-.148-.663.148-.196.295-.76.957-.932 1.153-.171.196-.343.221-.638.074-.294-.148-1.243-.458-2.368-1.462-.875-.78-1.466-1.744-1.638-2.039-.171-.295-.018-.454.13-.601.133-.133.294-.344.442-.516.147-.172.196-.295.294-.492.098-.196.05-.369-.024-.516-.074-.148-.663-1.598-.908-2.188-.239-.575-.482-.497-.663-.506l-.564-.01c-.196 0-.516.074-.786.369-.27.295-1.03 1.007-1.03 2.456 0 1.449 1.055 2.848 1.202 3.045.147.196 2.077 3.171 5.032 4.446.703.304 1.251.485 1.679.62.705.224 1.347.192 1.855.117.566-.085 1.741-.712 1.987-1.4.245-.688.245-1.277.172-1.4-.074-.123-.27-.196-.564-.344z" />
      </svg>
    </a>
  );
}
