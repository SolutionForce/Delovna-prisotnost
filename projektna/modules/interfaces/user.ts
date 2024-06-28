import { Timestamp } from "@firebase/firestore";

export enum Role {
    admin = "admin",
    employee = "employee",
    guest = "guest",
    receptionist = "receptionist"
}

export interface Break {
    start: Timestamp;
    end: Timestamp|null;
    description: string;
}

export interface Attendance {
    timeIn: Timestamp;
    timeOut: Timestamp|null;
    breaks: Break[];
}

export interface User {
    uid: string;
    name: string;
    surname: string;
    email: string;
    createdAt: Timestamp;
    organizationId: string;
    role: Role;
    attendance: Attendance[];
    hourlyRate: number;
}
