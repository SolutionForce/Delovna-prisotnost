import React, { useEffect, useState } from "react";
import { Button, Spinner, Text, XStack } from "tamagui";
import { User } from "../../modules/interfaces/user";
import pdfReportTemplate from "../../modules/functions/pdfReportTemplate";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import { Download } from "@tamagui/lucide-icons";
import { BookCheck } from "@tamagui/lucide-icons";
import { BookX } from "@tamagui/lucide-icons";
import { useIsFocused } from "@react-navigation/native";
import Colors from "../Colors/Colors";

interface DownloadReportProps {
  user: User;
}

const buttonDisabledOpacitiy = 0.4;

enum CreatePDFState {
  NOTHING,
  SUCCESS,
  ERROR,
}

export default function DownloadReport(
  props: DownloadReportProps
): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [savedFilePath, setSavedFilePath] = useState<CreatePDFState>(
    CreatePDFState.NOTHING
  );
  const isScreenFocused = useIsFocused();

  useEffect(() => {
    setSavedFilePath(CreatePDFState.NOTHING);
  }, [isScreenFocused]);

  const createPDF = async (html: string) => {
    const pdf = await Print.printToFileAsync({ html: html, base64: true });

    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) throw new Error("Permissions denied");

    const base64Data = pdf.base64!;
    await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      "Report",
      "application/pdf"
    ).then(async (uri) => {
      await FileSystem.writeAsStringAsync(uri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
    });
  };

  const handleGetPDF = async () => {
    setSavedFilePath(CreatePDFState.NOTHING);

    if (!props.user) {
      setSavedFilePath(CreatePDFState.ERROR);
      console.error("User for PDF report is unknown");
      return;
    }

    setLoading(true);
    const html = pdfReportTemplate(props.user);

    try {
      const filePath = await createPDF(html);
      setSavedFilePath(CreatePDFState.SUCCESS);
    } catch (error) {
      setSavedFilePath(CreatePDFState.ERROR);
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        icon={Download}
        scaleIcon={1.2}
        marginHorizontal="$2"
        theme="active"
        onPress={handleGetPDF}
        disabled={loading}
        opacity={loading ? buttonDisabledOpacitiy : undefined}
        backgroundColor={Colors.PURPLE}
      >
        Get PDF report
      </Button>
      {loading && (
        <XStack marginTop="$5" space="$2" justifyContent="center">
          <Spinner size="small" />
          <Text>Creating your PDF report...</Text>
        </XStack>
      )}
      {savedFilePath === CreatePDFState.SUCCESS && (
        <XStack marginTop="$5" space="$2" justifyContent="center">
          <BookCheck />
          <Text>Your PDF is saved successfully</Text>
        </XStack>
      )}
      {savedFilePath === CreatePDFState.ERROR && (
        <XStack marginTop="$5" space="$2" justifyContent="center">
          <BookX />
          <Text>PDF could not be saved</Text>
        </XStack>
      )}
    </>
  );
}
