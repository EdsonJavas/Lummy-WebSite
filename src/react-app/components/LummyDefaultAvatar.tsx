import { useState } from "react";
import { UserRound } from "lucide-react";
import { LUMMY_DEFAULT_AVATAR_URL } from "@/react-app/lib/lummyAssets";

type Props = {
  className?: string;
  size?: number;
  title?: string;
  /** Se no futuro houver `avatar_url` no perfil, passar aqui. */
  src?: string | null;
};

/** Avatar padrão Lummy — mesma arte PNG do app mobile. */
export default function LummyDefaultAvatar({
  className = "",
  size = 40,
  title,
  src,
}: Props) {
  const [failed, setFailed] = useState(false);
  const url = (src && src.trim() !== "" ? src : LUMMY_DEFAULT_AVATAR_URL) ?? "";

  return (
    <div
      role="img"
      aria-label={title ?? "Avatar Lummy"}
      title={title}
      className={`relative shrink-0 overflow-hidden rounded-full bg-slate-200 shadow-md ring-[2.5px] ring-white/95 dark:bg-slate-700 dark:ring-white/25 ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow:
          "0 0 0 1px rgba(139, 92, 246, 0.12), 0 4px 14px rgba(139, 92, 246, 0.22)",
      }}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500/20 to-indigo-600/30 text-violet-600 dark:text-violet-300">
          <UserRound className="h-[55%] w-[55%]" strokeWidth={1.75} />
        </div>
      ) : (
        <img
          src={url}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
