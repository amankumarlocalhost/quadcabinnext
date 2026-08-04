'use client';

// Centralises the quote-form submission flow (POST + submitting/toast state)
// that used to be copy-pasted as local useState + try/catch in five separate
// page views (products, industries, contact, about, home). Unlike the CMS/
// products/industries stores, this one IS a plain module-level singleton —
// it holds no server-rendered content, only ephemeral client-side UI state
// for an action that only ever runs from a browser click handler, so there's
// no SSR cross-request risk to design around.
import { create } from 'zustand';
import { submitQuoteForm } from '@/lib/cms/quotes.js';

export const useQuoteStore = create((set) => ({
  submitting: false,
  toast: false,

  async submit(form, sourcePage) {
    set({ submitting: true });
    try {
      await submitQuoteForm(form, sourcePage);
      form.reset();
      set({ submitting: false, toast: true });
      setTimeout(() => set({ toast: false }), 3200);
    } catch (error) {
      set({ submitting: false });
      window.alert(error.message);
    }
  },

  dismissToast() {
    set({ toast: false });
  },
}));
