import { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/Modal';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null); // { message, resolve }

  // confirm() mengembalikan Promise<boolean> -> bisa dipakai dengan "await"
  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setRequest({ message, resolve });
    });
  }, []);

  const handleAnswer = (answer) => {
    request.resolve(answer);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Modal open={!!request} onClose={() => handleAnswer(false)} title="Konfirmasi">
        <p style={{ margin: 0 }}>{request?.message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={() => handleAnswer(false)}>Batal</button>
          <button className="btn btn-danger" onClick={() => handleAnswer(true)}>Ya, Lanjutkan</button>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  return ctx.confirm;
}