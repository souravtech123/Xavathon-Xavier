import mongoose, { Schema, Document, Model } from "mongoose";

export interface IParticipant {
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string;
}

export interface IRegistration extends Document {
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  collegeName: string;
  department: string;
  semester: string;
  teamSize: number;
  participants: IParticipant[];
  projectTitle: string;
  problemStatement: string;
  projectDescription: string;
  domain: "AI/ML" | "Web Development" | "App Development" | "Cybersecurity" | "IoT" | "Open Innovation";
  technologies: string;
  githubLink?: string;
  demoLink?: string;
  whyParticipate: string;
  participatedBefore: boolean;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  rollNumber: { type: String, required: true },
  department: { type: String, required: true },
});

const RegistrationSchema = new Schema<IRegistration>(
  {
    teamId: { type: String, required: true, unique: true },
    teamName: { type: String, required: true },
    leaderName: { type: String, required: true },
    leaderEmail: { type: String, required: true },
    leaderPhone: { type: String, required: true },
    collegeName: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    teamSize: { type: Number, required: true },
    participants: [ParticipantSchema],
    projectTitle: { type: String, required: true },
    problemStatement: { type: String, required: true },
    projectDescription: { type: String, required: true },
    domain: {
      type: String,
      required: true,
      enum: ["AI/ML", "Web Development", "App Development", "Cybersecurity", "IoT", "Open Innovation"],
    },
    technologies: { type: String, required: true },
    githubLink: { type: String },
    demoLink: { type: String },
    whyParticipate: { type: String, required: true },
    participatedBefore: { type: Boolean, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Registration: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
