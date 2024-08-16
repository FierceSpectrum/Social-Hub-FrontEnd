import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import "./SecondFA.scss";

const enable2FA = async (email) => {
  try {
    const response = await fetch(
      "http://socialhub.codementoria.fsg/api/otp/enable-2fa",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.qrCodeUrl;
    } else {
      alert("Error generating QR code");
      return null;
    }
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    return null;
  }
};

const disable2FA = async (email) => {
  try {
    const response = await fetch(
      "http://socialhub.codementoria.fsg/api/otp/disable-2fa",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (response.ok) {
      return true;
    } else {
      alert("Error disabling 2FA");
      return false;
    }
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    return false;
  }
};

const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch(
      "http://socialhub.codementoria.fsg/api/otp/verify-otp",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.otpValid;
    } else {
      alert("Error verifying OTP");
      return false;
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};

const SecondFA = ({ email, is2FAEnabledProp }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(is2FAEnabledProp);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setIs2FAEnabled(is2FAEnabledProp);
  }, [is2FAEnabledProp]);

  const handleSwitchToggle = async () => {
    if (!is2FAEnabled) {
      // Si 2FA no está habilitado, abre el modal y genera el QR
      const qrCode = await enable2FA(email);
      if (qrCode) {
        setQrCodeUrl(qrCode);
        setIsModalOpen(true);
      }
    } else {
      // Si 2FA está habilitado, desactiva 2FA
      const success = await disable2FA(email);
      if (success) {
        setIs2FAEnabled(false);
        alert("2FA disabled successfully");
      }
    }
  };

  const handleOTPVerification = async () => {
    if (otp.length !== 6 || isNaN(otp)) {
      alert("El código OTP debe tener exactamente 6 dígitos.");
      return;
    }

    const isValid = await verifyOTP(email, otp);
    if (isValid) {
      setIs2FAEnabled(true);
      setIsModalOpen(false);
      alert("2FA enabled successfully");
    } else {
      alert("Error verifying OTP");
    }
  };

  const handleModalClose = async () => {
    await disable2FA(email);
    setIsModalOpen(false);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Permitir solo números y limitar la longitud a 6 caracteres
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div className="second-fa">
      <label className="switch">
        <input
          type="checkbox"
          checked={is2FAEnabled}
          onChange={() => {
            handleSwitchToggle();
          }}
        />
        <span className="slider"></span>
      </label>
      <p>Segundo FA</p>

      {/* Renderizar el modal si está abierto */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <h2>Habilitar 2FA</h2>
        <p>Escanea el código QR con Google Authenticator:</p>
        <img src={qrCodeUrl} alt="QR Code" />
        <p>Introduce el código generado por Google Authenticator:</p>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Introduce OTP"
          maxLength={6} // Limita la longitud del campo a 6 caracteres
        />
        <div className="modal-actions">
          <button onClick={handleOTPVerification}>Verificar y habilitar</button>
          <button onClick={handleModalClose}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default SecondFA;
