export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffMinutes < 1) return "Actualizado ahora";
  if (diffMinutes < 60) return `Actualizado hace ${diffMinutes} min`;
  if (diffMinutes < 1440)
    return `Actualizado hace ${Math.floor(diffMinutes / 60)}h`;

  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};
