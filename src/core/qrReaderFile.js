// ======================================================
// qrReaderFile.js — Lecture d'un QR Code depuis un fichier image
// ------------------------------------------------------
// - Utilise QrScanner (global) pour lire l'image
// - Récupère toujours une STRING pour le texte du QR
// - Passe cette string brute à decodeFiche
// ======================================================

import { decodeFiche } from "./compression.js";

export async function readQrFromFile(file) {
  if (!file) {
    throw new Error("Aucun fichier fourni.");
  }

  if (!window.QrScanner) {
    throw new Error("QrScanner n'est pas chargé. Vérifie l'import dans index.html.");
  }

  const imgUrl = URL.createObjectURL(file);
  console.log("[QR FILE] URL image temporaire :", imgUrl);

  try {
    // On demande le résultat détaillé pour voir ce que renvoie réellement QrScanner
    const scanResult = await window.QrScanner.scanImage(imgUrl, {
      returnDetailedScanResult: true
    });

    console.log("[QR FILE] Résultat brut QrScanner :", scanResult);

    // Selon les versions, QrScanner peut renvoyer soit une string, soit un objet { data: "..." }
    const text =
      typeof scanResult === "string"
        ? scanResult
        : (scanResult && scanResult.data) || "";

    console.log("[QR FILE] Texte extrait du QR :", text);

    if (!text) {
      throw new Error("Aucune donnée texte trouvée dans le QR.");
    }

    // Très important : on passe BIEN une STRING à decodeFiche,
    // surtout PAS un objet JSON.parse(text)
    const fiche = decodeFiche(text);
    console.log("[QR FILE] Fiche décodée :", fiche);

    return fiche;
  } catch (e) {
    console.error("[QR FILE] Erreur lors de la lecture du fichier :", e);
    throw new Error("Impossible de lire le QR : " + (e.message || e));
  } finally {
    URL.revokeObjectURL(imgUrl);
  }
}
