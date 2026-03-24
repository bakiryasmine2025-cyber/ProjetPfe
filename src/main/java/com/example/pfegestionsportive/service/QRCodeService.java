package com.example.pfegestionsportive.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {

    private static final int QR_WIDTH  = 300;
    private static final int QR_HEIGHT = 300;

    /**
     * Génère un QR Code réel en Base64 PNG
     * @param content  le texte à encoder (ex: codeTicket UUID)
     * @return         "data:image/png;base64,xxxxx..." prêt pour <img src="...">
     */
    public String generateQRCodeBase64(String content) {
        try {
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 2);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix bitMatrix = writer.encode(content, BarcodeFormat.QR_CODE, QR_WIDTH, QR_HEIGHT, hints);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            String base64 = Base64.getEncoder().encodeToString(outputStream.toByteArray());
            return "data:image/png;base64," + base64;

        } catch (WriterException | IOException e) {
            throw new RuntimeException("Erreur génération QR Code: " + e.getMessage());
        }
    }

    /**
     * Valide que le contenu scanné correspond bien au codeTicket
     */
    public boolean validateQRContent(String scannedContent, String expectedCode) {
        return scannedContent != null && scannedContent.equals(expectedCode);
    }
}
