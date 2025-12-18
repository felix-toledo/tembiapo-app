import React from "react";

interface LoginWithGoogleButtonProps {
  className?: string;
  text?: string;
  onClick?: () => void;
}

export default function LoginWithGoogleButton({
  className = "",
  text = "Continuar con Google",
}: Omit<LoginWithGoogleButtonProps, "onClick">) {
  const handleGoogleLogin = () => {
    // URL construct based on backend service requirements
    // Backend controller expects a code from Google, so we initiate standard OAuth2 flow
    // Endpoint: https://accounts.google.com/o/oauth2/v2/auth?
    // client_id=...&redirect_uri=...&response_type=code&scope=...

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
    // Important: this redirect_uri must match EXACTLY what backend sends to Google for exchange
    const redirectUri = `${apiUrl}/google/callback`;
    console.log("DEBUG REDIRECT URI:", redirectUri);
    const scope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" ");

    if (!clientId) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
      alert("Configuración de Google Auth faltante");
      return;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&access_type=offline&prompt=consent`;

    console.log("Redirecting to Google Auth with URI:", redirectUri);
    window.location.href = authUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className={`
        relative flex items-center justify-center w-full px-4 py-3 
        bg-white border text-gray-700 
        font-medium rounded-lg shadow-sm 
        hover:bg-gray-50 hover:shadow-md transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200
        ${className}
      `}
      style={{
        borderColor: "#dadce0",
      }}
    >
      <div className="absolute left-4 w-5 h-5">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          ></path>
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          ></path>
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          ></path>
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          ></path>
        </svg>
      </div>
      <span className="text-gray-600 font-semibold">{text}</span>
    </button>
  );
}
