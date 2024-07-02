import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import {
  Button,
  H3,
  Separator,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
} from "tamagui";
import { usersDBAtom } from "../../../Atoms/UsersDBAtom";
import { Attendance, Break, User } from "../../../modules/interfaces/user";
import { Timestamp } from "@firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../../../services/api/firebaseConfig";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import Colors from "../../Colors/Colors";
import { useNavigation } from "@react-navigation/native";
import { verifyTOTPcode } from "../../../services/api/api";

interface ConfirmScanProps {
  scannedData: string;
}

const buttonDisabledOpacitiy = 0.4;

export default function ConfirmScan(props: ConfirmScanProps) {
  const [users] = useAtom(usersDBAtom);
  const [breakDescription, setbreakDescription] = useState<string>("");
  const [breakDescriptionEmptyError, setbreakDescriptionEmptyError] =
    useState<boolean>(false);
  const [submissionStatusText, setSubmissionStatusText] = useState<string>("");
  const [loadingVerify, setLoadingVerify] = useState<boolean>(true);
  const [loadingToSave, setLoadingToSave] = useState<boolean>(false);
  const [attendanceVerified, setAttendanceVerified] = useState<boolean>(false);
  const currentUser: User | undefined = users.find(
    (user) => user.uid === (auth.currentUser?.uid || "")
  );
  const timeNow: Timestamp = Timestamp.now();
  const navigator = useNavigation();

  if (!currentUser)
    return (
      <XStack justifyContent="center">
        <H3 color="red">Current user unknown</H3>
      </XStack>
    );

  const submissionStatus = (message: string) => {
    setbreakDescriptionEmptyError(false);
    setbreakDescription("");
    setLoadingToSave(false);
    setSubmissionStatusText(message);
  };

  const isSavingStillAllowed = async (): Promise<boolean> => {
    setLoadingToSave(true);
    const isAllowed = await verifyTOTPcode(props.scannedData);

    if (isAllowed) return true;

    submissionStatus(
      "Error: QR code verification expired. Scan the QR code again."
    );
    return false;
  };

  const saveStartedWork = async () => {
    if (!(await isSavingStillAllowed())) return;

    const currentUserDoc = doc(firestore, "users", currentUser.uid);
    const newAttendance: Attendance = {
      timeIn: timeNow,
      timeOut: null,
      breaks: [],
    };
    try {
      await setDoc(
        currentUserDoc,
        { attendance: [...currentUser.attendance, newAttendance] },
        { merge: true }
      );
      submissionStatus("Successfully saved 'Started work'");
    } catch (error) {
      console.warn("Could not save 'Started work'");
      submissionStatus("Could not save 'Started work'");
    }
  };

  const saveEndedWork = async () => {
    if (!(await isSavingStillAllowed())) return;

    const currentUserDoc = doc(firestore, "users", currentUser.uid);
    const updatedAttendances = [...currentUser.attendance];

    try {
      updatedAttendances[updatedAttendances.length - 1].timeOut = timeNow;
      await setDoc(
        currentUserDoc,
        { attendance: updatedAttendances },
        { merge: true }
      );
      submissionStatus("Successfully saved 'Ended work'");
    } catch (error) {
      console.warn("Could not save 'Ended work'");
      submissionStatus("Could not save 'Ended work'");
    }
  };

  const saveStartedABreak = async () => {
    if (breakDescription === "") {
      setbreakDescriptionEmptyError(true);
      setSubmissionStatusText("");
      return;
    }

    setbreakDescriptionEmptyError(false);

    if (!(await isSavingStillAllowed())) return;

    const currentUserDoc = doc(firestore, "users", currentUser.uid);
    const updatedAttendances = [...currentUser.attendance];

    const newBreak: Break = {
      start: timeNow,
      end: null,
      description: breakDescription,
    };

    try {
      updatedAttendances[updatedAttendances.length - 1].breaks.push(newBreak);
      await setDoc(
        currentUserDoc,
        { attendance: updatedAttendances },
        { merge: true }
      );
      submissionStatus("Successfully saved 'Started a break'");
    } catch (error) {
      console.warn("Could not save 'Started a break'");
      submissionStatus("Could not save 'Started a break'");
    }
  };

  const saveEndedABreak = async (e: GestureResponderEvent) => {
    if (!(await isSavingStillAllowed())) return;

    const currentUserDoc = doc(firestore, "users", currentUser.uid);
    const updatedAttendances = [...currentUser.attendance];

    try {
      updatedAttendances[updatedAttendances.length - 1].breaks[
        updatedAttendances[updatedAttendances.length - 1].breaks.length - 1
      ].end = timeNow;
      updatedAttendances[updatedAttendances.length - 1].breaks[
        updatedAttendances[updatedAttendances.length - 1].breaks.length - 1
      ].description += breakDescription !== "" ? " / " + breakDescription : "";
      await setDoc(
        currentUserDoc,
        { attendance: updatedAttendances },
        { merge: true }
      );
      submissionStatus("Successfully saved 'Ended a break'");
    } catch (error) {
      console.warn("Could not save 'Ended a break'");
      submissionStatus("Could not save 'Ended a break'");
    }
  };

  const isStartWorkAllowed = (): boolean => {
    if (currentUser.attendance.length === 0) return true;

    if (currentUser.attendance[currentUser.attendance.length - 1].timeOut)
      return true;

    return false;
  };

  const isEndWorkAllowed = (): boolean => {
    if (currentUser.attendance.length === 0) return false;

    if (!currentUser.attendance[currentUser.attendance.length - 1].timeOut) {
      const breaks =
        currentUser.attendance[currentUser.attendance.length - 1].breaks;
      if (breaks.length === 0) return true;

      if (breaks[breaks.length - 1].end) return true;
    }

    return false;
  };

  const isStartABreakAllowed = (): boolean => {
    if (currentUser.attendance.length === 0) return false;

    if (!currentUser.attendance[currentUser.attendance.length - 1].timeOut) {
      const breaks =
        currentUser.attendance[currentUser.attendance.length - 1].breaks;
      if (breaks.length === 0) return true;

      if (breaks[breaks.length - 1].end) return true;
    }

    return false;
  };

  const isEndABreakAllowed = (): boolean => {
    if (currentUser.attendance.length === 0) return false;

    if (!currentUser.attendance[currentUser.attendance.length - 1].timeOut) {
      const breaks =
        currentUser.attendance[currentUser.attendance.length - 1].breaks;
      if (breaks.length === 0) return false;

      if (!breaks[breaks.length - 1].end) return true;
    }

    return false;
  };

  const verifyAttendanceCode = async () => {
    try {
      setAttendanceVerified(await verifyTOTPcode(props.scannedData));
    } catch (error) {
      console.error(error);
      setAttendanceVerified(false);
    }

    setLoadingVerify(false);
  };

  useEffect(() => {
    verifyAttendanceCode();
  }, [auth.currentUser, props.scannedData]);

  const disableStartWork = !isStartWorkAllowed();
  const disableEndWork = !isEndWorkAllowed();
  const disableStartBreak = !isStartABreakAllowed();
  const disableEndBreak = !isEndABreakAllowed();
  const date = timeNow.toDate().toLocaleString("sl-SI").split(",");

  if (loadingVerify)
    return (
      <XStack justifyContent="center">
        <H3>
          <Spinner color="black" /> Verifying
        </H3>
      </XStack>
    );

  if (!attendanceVerified)
    return (
      <XStack justifyContent="center">
        <H3 color="red">Scanned QR code not valid</H3>
      </XStack>
    );

  if (loadingToSave)
    return (
      <XStack justifyContent="center">
        <H3>
          <Spinner color="black" /> Saving
        </H3>
      </XStack>
    );

  if (submissionStatusText !== "")
    return (
      <YStack>
        <XStack justifyContent="center" marginTop="$5">
          <H3>{submissionStatusText}</H3>
        </XStack>
        <Button
          style={styles.gumb}
          theme="active"
          onPress={() => {
            navigator.navigate("Home" as never);
          }}
        >
          Home
        </Button>
      </YStack>
    );

  return (
    <YStack style={styles.container}>
      <View style={styles.predgovor}>
        <>
          <Text style={styles.dobrodosel}>Welcome back to work</Text>
          <Text style={styles.dobrodosel}>
            {currentUser.name} {currentUser.surname}!
          </Text>
        </>

        <Text style={styles.datum}>
          Today is <Text style={styles.boldItalic}>{date[0]}</Text> and you
          logged in at <Text style={styles.boldItalic}>{date[1]}</Text>. Have a
          nice working day.
        </Text>
      </View>

      <XStack marginTop={20} justifyContent="center">
        <Text style={styles.statusText}>{submissionStatusText}</Text>
      </XStack>

      <Text style={styles.sectionTitle}>Work</Text>
      <XStack marginTop={20} space={20} justifyContent="center">
        <Button
          style={styles.gumb}
          theme="active"
          size="$6"
          onPress={saveStartedWork}
          disabled={disableStartWork}
          opacity={disableStartWork ? buttonDisabledOpacitiy : undefined}
        >
          Started
        </Button>
        <Button
          style={styles.gumb}
          theme="active"
          size="$6"
          onPress={saveEndedWork}
          disabled={disableEndWork}
          opacity={disableEndWork ? buttonDisabledOpacitiy : undefined}
        >
          Ended
        </Button>
      </XStack>

      <Separator style={styles.separator} />

      <Text style={styles.sectionTitle}>Break</Text>
      <XStack space={20} justifyContent="center" marginBottom={20}>
        <Button
          style={styles.gumb}
          theme="active"
          size="$6"
          onPress={saveStartedABreak}
          disabled={disableStartBreak}
          opacity={disableStartBreak ? buttonDisabledOpacitiy : undefined}
        >
          Started
        </Button>
        <Button
          style={styles.gumb}
          theme="active"
          size="$6"
          onPress={saveEndedABreak}
          disabled={disableEndBreak}
          opacity={disableEndBreak ? buttonDisabledOpacitiy : undefined}
        >
          Ended
        </Button>
      </XStack>
      {breakDescriptionEmptyError && (
        <XStack justifyContent="center">
          <Text style={styles.description} fontSize="$6" color="red">
            Description for a break is required
          </Text>
        </XStack>
      )}
      <TextArea
        style={styles.breakArea}
        size="$4"
        borderWidth={2}
        placeholder="Enter a description of the break..."
        defaultValue={breakDescription}
        onChangeText={(e) => {
          setbreakDescription(e);
          setbreakDescriptionEmptyError(false);
        }}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  predgovor: {
    backgroundColor: Colors.PURPLE,
    opacity: 0.8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.BLACK,
    marginTop: 6,
    padding: 10,
  },
  dobrodosel: {
    fontSize: 20,
    color: Colors.BLACK,
    marginBottom: 10,
  },
  datum: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  boldItalic: {
    fontWeight: "bold",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.BLACK,
    textAlign: "center",
    marginVertical: 20,
  },
  gumb: {
    borderRadius: 50,
    backgroundColor: Colors.PURPLE,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  gumbTekts: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.BLACK,
    marginVertical: 20,
    width: "80%",
    alignSelf: "center",
  },
  breakArea: {
    borderWidth: 1,
    borderColor: Colors.BLACK,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    textAlignVertical: "top",
    height: 100,
    width: "100%",
  },
  statusText: {
    fontSize: 18,
    color: Colors.BLACK,
  },
  description: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
