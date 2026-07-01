import React, { useState } from "react";
import { z } from "zod";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  UserPlus,
  Phone,
  MapPin,
  Mail,
  FileCheck,
  Award,
  ChevronLeft,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  CreditCard,
  Printer,
} from "lucide-react";
import {
  Student,
  SchoolClass,
  Grade,
  Exam,
  Subject,
  Attendance,
  Invoice,
  SchoolProfile,
} from "../types";
import Papa from "papaparse";
import { QRCodeSVG } from "qrcode.react";

const studentSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit comporter au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("L'adresse e-mail est invalide"),
  parentPhone: z
    .string()
    .regex(
      /^[0-9\-\+\s]{8,15}$/,
      "Le numéro de téléphone est invalide (8 à 15 caractères)",
    ),
});

interface StudentsViewProps {
  students: Student[];
  classes: SchoolClass[];
  grades: Grade[];
  exams: Exam[];
  subjects: Subject[];
  attendances: Attendance[];
  invoices: Invoice[];
  school?: SchoolProfile | null;
  onAddStudent: (student: Omit<Student, "id">) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export default function StudentsView({
  students,
  classes,
  grades,
  exams,
  subjects,
  attendances,
  invoices,
  school,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}: StudentsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Student modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Student Profile Detail state
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [showIdCard, setShowIdCard] = useState<boolean>(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "Other">("M");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  const openAddModal = () => {
    setModalMode("add");
    setFirstName("");
    setLastName("");
    setRollNumber(`2026-${String(students.length + 1).padStart(3, "0")}`);
    setClassId(classes[0]?.id || "");
    setSection(classes[0]?.section || "A");
    setEmail("");
    setGender("M");
    setParentName("");
    setParentPhone("");
    setAddress("");
    setStatus("Active");
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setModalMode("edit");
    setEditingStudent(student);
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setRollNumber(student.rollNumber);
    setClassId(student.classId);
    setSection(student.section);
    setEmail(student.email);
    setGender(student.gender);
    setParentName(student.parentName);
    setParentPhone(student.parentPhone);
    setAddress(student.address);
    setStatus(student.status);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      studentSchema.parse({ firstName, lastName, email, parentPhone });
    } catch (err: any) {
      if (err && typeof err === "object" && "errors" in err) {
        alert(err.errors.map((e: any) => e.message).join("\n"));
      }
      return;
    }

    if (modalMode === "add") {
      onAddStudent({
        firstName,
        lastName,
        rollNumber,
        classId,
        section,
        email,
        gender,
        parentName,
        parentPhone,
        address,
        status,
        admissionDate: new Date().toISOString().split("T")[0],
      });
    } else if (modalMode === "edit" && editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        firstName,
        lastName,
        rollNumber,
        classId,
        section,
        email,
        gender,
        parentName,
        parentPhone,
        address,
        status,
      });
    }
    setIsModalOpen(false);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let successCount = 0;
        let errorCount = 0;

        results.data.forEach((row: any) => {
          try {
            if (!row.firstName || !row.lastName) {
              errorCount++;
              return;
            }

            let assignedClassId = classes[0]?.id || "";
            if (row.className) {
              const foundClass = classes.find(
                (c) => c.name.toLowerCase() === row.className.toLowerCase(),
              );
              if (foundClass) assignedClassId = foundClass.id;
            }

            onAddStudent({
              firstName: row.firstName,
              lastName: row.lastName,
              rollNumber:
                row.rollNumber ||
                `2026-${String(students.length + successCount + 1).padStart(3, "0")}`,
              classId: assignedClassId,
              section: row.section || "A",
              email: row.email || "",
              gender:
                row.gender === "F" ||
                row.gender === "M" ||
                row.gender === "Other"
                  ? row.gender
                  : "M",
              parentName: row.parentName || "",
              parentPhone: row.parentPhone || "",
              address: row.address || "",
              status: "Active",
              admissionDate: new Date().toISOString().split("T")[0],
            });
            successCount++;
          } catch (err) {
            errorCount++;
          }
        });

        alert(
          `Import terminé : ${successCount} élèves ajoutés. ${errorCount} erreurs ignorées.`,
        );
      },
      error: (error) => {
        alert("Erreur lors de la lecture du fichier CSV: " + error.message);
      },
    });

    if (e.target) {
      e.target.value = "";
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      selectedClassId === "all" || student.classId === selectedClassId;
    const matchesStatus =
      selectedStatus === "all" || student.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Calculate detailed views for a specific student profile
  const getStudentMetrics = (studentId: string) => {
    // 1. Get grades
    const studentGrades = grades.filter((g) => g.studentId === studentId);
    const gradeDetails = studentGrades.map((g) => {
      const exam = exams.find((e) => e.id === g.examId);
      const subject = exam
        ? subjects.find((s) => s.id === exam.subjectId)
        : null;
      return {
        examName: exam ? exam.name : "Examen",
        subjectName: subject ? subject.name : "Matière",
        marksObtained: g.marksObtained,
        maxMarks: exam ? exam.maxMarks : 20,
        remarks: g.remarks,
        percentage: exam ? (g.marksObtained / exam.maxMarks) * 100 : 0,
      };
    });

    // Average grade (standardized to base 20 for French system)
    const averageGrade =
      gradeDetails.length > 0
        ? (
            gradeDetails.reduce(
              (sum, g) => sum + (g.marksObtained / g.maxMarks) * 20,
              0,
            ) / gradeDetails.length
          ).toFixed(2)
        : null;

    // 2. Attendance rates
    let totalDays = 0;
    let daysPresent = 0;
    let daysLate = 0;

    attendances.forEach((att) => {
      if (att.records[studentId]) {
        totalDays++;
        if (att.records[studentId] === "Present") daysPresent++;
        if (att.records[studentId] === "Late") {
          daysPresent++; // count late as present for general presence rate
          daysLate++;
        }
      }
    });

    const attendanceRate =
      totalDays > 0 ? Math.round((daysPresent / totalDays) * 100) : 100;

    // 3. Invoices
    const studentInvoices = invoices.filter(
      (inv) => inv.studentId === studentId,
    );
    const outstandingFees = studentInvoices.reduce((sum, inv) => {
      if (inv.status !== "Paid") {
        return sum + (inv.amount - inv.paidAmount);
      }
      return sum;
    }, 0);

    return {
      gradeDetails,
      averageGrade,
      attendanceRate,
      totalDays,
      daysLate,
      daysAbsent: totalDays - daysPresent,
      studentInvoices,
      outstandingFees,
    };
  };

  return (
    <div className="space-y-6">
      {/* If viewing student profile detail */}
      {viewingStudent ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setViewingStudent(null)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-2xs hover:shadow-xs transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour à la liste des élèves
            </button>
            <button
              onClick={() => setShowIdCard(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-2xs hover:shadow-xs transition-all"
            >
              <CreditCard className="h-4 w-4" />
              Carte d'identité
            </button>
          </div>

          {/* Student Header Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-50/50 rounded-full blur-2xl -z-1" />
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl uppercase shadow-sm">
                {viewingStudent.firstName[0]}
                {viewingStudent.lastName[0]}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-gray-900">
                    {viewingStudent.firstName} {viewingStudent.lastName}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                      viewingStudent.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}
                  >
                    {viewingStudent.status === "Active" ? "Actif" : "Inactif"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Matricule:{" "}
                  <span className="font-mono font-medium text-gray-600">
                    {viewingStudent.rollNumber}
                  </span>
                </p>

                <div className="flex gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1 font-medium text-indigo-700 bg-indigo-50/50 px-2 py-0.5 rounded-md">
                    Classe:{" "}
                    {classes.find((c) => c.id === viewingStudent.classId)?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    Section: {viewingStudent.section}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats on the student */}
            <div className="grid grid-cols-3 gap-2.5 max-w-sm w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 text-xs text-center">
              <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                <div className="text-gray-400 text-[10px] uppercase font-medium">
                  Moyenne
                </div>
                <div className="text-lg font-bold text-indigo-600 mt-1">
                  {getStudentMetrics(viewingStudent.id).averageGrade
                    ? `${getStudentMetrics(viewingStudent.id).averageGrade}/20`
                    : "N/A"}
                </div>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                <div className="text-gray-400 text-[10px] uppercase font-medium">
                  Assiduité
                </div>
                <div className="text-lg font-bold text-emerald-600 mt-1">
                  {getStudentMetrics(viewingStudent.id).attendanceRate}%
                </div>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                <div className="text-gray-400 text-[10px] uppercase font-medium">
                  Solde Dû
                </div>
                <div className="text-lg font-bold text-rose-500 mt-1">
                  {getStudentMetrics(viewingStudent.id).outstandingFees} €
                </div>
              </div>
            </div>
          </div>

          {/* Detailed sections: contact info, grades, attendance, invoicing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Contact Info & Parent Details */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-5">
              <h3 className="font-semibold text-gray-950 text-sm pb-2 border-b border-gray-50 flex items-center gap-2">
                Coordonnées de l'Élève & Famille
              </h3>

              <div className="space-y-4 text-xs">
                {/* Email */}
                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-gray-400 font-medium">
                      E-mail institutionnel
                    </div>
                    <div className="text-gray-900 mt-0.5 font-medium">
                      {viewingStudent.email}
                    </div>
                  </div>
                </div>

                {/* Gender / Admissions */}
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-gray-400 font-medium">
                      Date d'admission & Sexe
                    </div>
                    <div className="text-gray-900 mt-0.5 font-medium">
                      Admis le {viewingStudent.admissionDate} • Sexe:{" "}
                      {viewingStudent.gender === "M"
                        ? "Masculin"
                        : viewingStudent.gender === "F"
                          ? "Féminin"
                          : "Autre"}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-gray-400 font-medium">
                      Adresse de résidence
                    </div>
                    <div className="text-gray-900 mt-0.5 font-medium">
                      {viewingStudent.address}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="font-semibold text-gray-950 text-sm mb-3">
                    Tuteur Légal / Parent
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="h-6 w-6 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0">
                        P
                      </div>
                      <div>
                        <div className="text-gray-400 font-medium">
                          Nom complet
                        </div>
                        <div className="text-gray-900 mt-0.5 font-medium">
                          {viewingStudent.parentName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-gray-400 font-medium">
                          Téléphone de contact
                        </div>
                        <div className="text-gray-900 mt-0.5 font-medium">
                          {viewingStudent.parentPhone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center & Right Col: Grades and Invoices */}
            <div className="lg:col-span-2 space-y-6">
              {/* Report Card (Bulletin des notes) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-950 text-sm flex items-center gap-2">
                      <Award className="h-4 w-4 text-indigo-500" />
                      Bulletin Trimestriel (Contrôles continus)
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-medium bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                        Moyenne:{" "}
                        {getStudentMetrics(viewingStudent.id).averageGrade
                          ? `${getStudentMetrics(viewingStudent.id).averageGrade}/20`
                          : "Pas de note"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-1.5 rounded-lg">
                    <QRCodeSVG
                      value={`AUTH|BULLETIN|${viewingStudent.id}|${Date.now()}`}
                      size={40}
                      level="L"
                      includeMargin={false}
                    />
                    <div className="text-[8px] text-gray-400 font-medium max-w-[60px] leading-tight">
                      Authenticité Vérifiable
                    </div>
                  </div>
                </div>

                {getStudentMetrics(viewingStudent.id).gradeDetails.length >
                0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-500">
                      <thead className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold rounded-l-lg">
                            Matière
                          </th>
                          <th className="py-2.5 px-3 font-semibold">
                            Examen / Devoir
                          </th>
                          <th className="py-2.5 px-3 font-semibold text-center">
                            Note
                          </th>
                          <th className="py-2.5 px-3 font-semibold text-right rounded-r-lg">
                            Appréciation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {getStudentMetrics(viewingStudent.id).gradeDetails.map(
                          (grade, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50">
                              <td className="py-3 px-3 font-medium text-gray-900">
                                {grade.subjectName}
                              </td>
                              <td className="py-3 px-3 text-gray-500">
                                {grade.examName}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                                    grade.marksObtained / grade.maxMarks >= 0.7
                                      ? "bg-emerald-50 text-emerald-700"
                                      : grade.marksObtained / grade.maxMarks >=
                                          0.5
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-rose-50 text-rose-700"
                                  }`}
                                >
                                  {grade.marksObtained} / {grade.maxMarks}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right text-gray-400 italic text-[11px]">
                                {grade.remarks}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-100 rounded-xl bg-gray-50/50 text-xs text-gray-400">
                    Aucune note n'a été enregistrée pour cet élève actuellement.
                  </div>
                )}
              </div>

              {/* Invoicing list */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                <h3 className="font-semibold text-gray-950 text-sm flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-500" />
                  Factures & Cotisations
                </h3>

                {getStudentMetrics(viewingStudent.id).studentInvoices.length >
                0 ? (
                  <div className="space-y-2.5">
                    {getStudentMetrics(viewingStudent.id).studentInvoices.map(
                      (inv) => (
                        <div
                          key={inv.id}
                          className="p-3 border border-gray-100 bg-gray-50/50 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">
                              {inv.type}
                            </div>
                            <div className="text-gray-400 text-[10px]">
                              Émise le {inv.date} • Échéance: {inv.dueDate}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold text-gray-900">
                                {inv.amount} €
                              </div>
                              {inv.status === "Partial" && (
                                <div className="text-[10px] text-gray-400">
                                  Payé: {inv.paidAmount} €
                                </div>
                              )}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                                inv.status === "Paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : inv.status === "Partial"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {inv.status === "Paid"
                                ? "Payée"
                                : inv.status === "Partial"
                                  ? "Partiel"
                                  : "Non payée"}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-100 rounded-xl bg-gray-50/50 text-xs text-gray-400">
                    Aucune facture émise pour cet élève.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ID Card Modal */}
          {showIdCard && (
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col relative">
                <button
                  onClick={() => setShowIdCard(false)}
                  className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-gray-500 hover:text-gray-900 p-1.5 rounded-full shadow-sm transition-all"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="p-6 pb-2" id="id-card-content">
                  <div className="border-2 border-indigo-100 rounded-xl overflow-hidden bg-white relative">
                    <div className="h-20 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center px-4">
                      {school?.logoUrl ? (
                        <img
                          src={school.logoUrl}
                          alt="Logo"
                          className="h-10 w-auto bg-white p-1 rounded-md shadow-sm"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-white rounded-md shadow-sm flex items-center justify-center font-bold text-indigo-600">
                          {school?.name?.charAt(0) || "S"}
                        </div>
                      )}
                      <div className="ml-3 text-white">
                        <div className="font-bold text-[11px] leading-tight max-w-[150px] truncate">
                          {school?.name || "SmartSchool"}
                        </div>
                        <div className="text-[9px] opacity-80 mt-0.5">
                          CARTE D'IDENTITÉ ÉTUDIANT
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-4 flex gap-4">
                      <div className="shrink-0 space-y-2">
                        <div className="h-20 w-16 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-gray-400 overflow-hidden">
                          {viewingStudent.gender === "M" ? (
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingStudent.id}&style=circle&backgroundColor=e2e8f0`}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingStudent.id}&style=circle&backgroundColor=e2e8f0`}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex justify-center">
                          <QRCodeSVG
                            value={`ID:${viewingStudent.id}|Name:${viewingStudent.firstName} ${viewingStudent.lastName}|School:${school?.id || "default"}`}
                            size={60}
                            level="M"
                            includeMargin={false}
                          />
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 text-[10px]">
                        <div>
                          <div className="text-gray-400 font-medium">
                            Nom complet
                          </div>
                          <div className="font-bold text-gray-900 text-xs uppercase">
                            {viewingStudent.firstName} {viewingStudent.lastName}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-gray-400 font-medium">
                              Matricule
                            </div>
                            <div className="font-semibold text-gray-700">
                              {viewingStudent.rollNumber}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-medium">
                              Classe
                            </div>
                            <div className="font-semibold text-gray-700">
                              {
                                classes.find(
                                  (c) => c.id === viewingStudent.classId,
                                )?.name
                              }
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400 font-medium">
                            Année Scolaire
                          </div>
                          <div className="font-semibold text-gray-700">
                            2026-2027
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100 mt-2 text-[8px] text-gray-400 italic">
                          Cette carte est strictement personnelle et valide pour
                          l'année scolaire en cours.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      const printContent =
                        document.getElementById("id-card-content");
                      const windowPrint = window.open(
                        "",
                        "",
                        "width=800,height=600",
                      );
                      if (windowPrint && printContent) {
                        windowPrint.document.write(`
                          <html>
                            <head>
                              <title>Impression Carte d'identité</title>
                              <style>
                                body { font-family: system-ui, -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f9fafb; }
                                .card { width: 340px; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                                .header { height: 70px; background: #4f46e5; display: flex; align-items: center; padding: 0 16px; color: white; }
                                .logo { height: 40px; background: white; padding: 4px; border-radius: 6px; }
                                .header-text { margin-left: 12px; }
                                .header-title { font-weight: bold; font-size: 14px; text-transform: uppercase; margin-bottom: 2px; }
                                .header-subtitle { font-size: 10px; opacity: 0.9; }
                                .body { padding: 16px; display: flex; gap: 16px; }
                                .left-col { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 70px; }
                                .photo { width: 64px; height: 80px; background: #f3f4f6; border-radius: 8px; border: 1px solid #e5e7eb; }
                                .qr-placeholder { width: 60px; height: 60px; }
                                .right-col { flex: 1; font-size: 11px; }
                                .label { color: #6b7280; margin-bottom: 2px; font-size: 10px; }
                                .value { font-weight: 600; color: #111827; margin-bottom: 8px; }
                                .value.name { font-size: 14px; text-transform: uppercase; }
                                .row { display: flex; gap: 16px; }
                                .footer { padding-top: 8px; border-top: 1px solid #f3f4f6; margin-top: 8px; font-size: 9px; color: #9ca3af; font-style: italic; }
                              </style>
                            </head>
                            <body>
                              ${printContent.innerHTML}
                              <script>
                                setTimeout(() => { window.print(); window.close(); }, 500);
                              </script>
                            </body>
                          </html>
                        `);
                        windowPrint.document.close();
                      }
                    }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimer la carte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Standard Students list view
        <div className="space-y-6">
          {/* Top header controls */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                Registre des Élèves
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Rechercher, filtrer et gérer les élèves de l'établissement.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => document.getElementById("csv-upload")?.click()}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Import en masse (CSV)
              </button>
              <input
                type="file"
                id="csv-upload"
                accept=".csv"
                className="hidden"
                onChange={handleCSVUpload}
              />
              <button
                onClick={openAddModal}
                id="btn-add-student"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                Inscrire un Élève
              </button>
            </div>
          </div>

          {/* Filtering and search row */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, matricule, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Class */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-gray-400 font-medium">
                  Classe:
                </span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="text-xs py-2 bg-gray-50/70 border border-gray-200 rounded-xl px-2.5 focus:outline-hidden focus:border-indigo-500 focus:bg-white font-medium text-gray-700"
                >
                  <option value="all">Toutes les classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Status */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-gray-400 font-medium">
                  Statut:
                </span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-xs py-2 bg-gray-50/70 border border-gray-200 rounded-xl px-2.5 focus:outline-hidden focus:border-indigo-500 focus:bg-white font-medium text-gray-700"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Active">Actifs uniquement</option>
                  <option value="Inactive">Inactifs uniquement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/60 text-gray-400 uppercase tracking-wider text-[10px] font-semibold border-b border-gray-100">
                      <th className="py-3 px-4 font-semibold">Identité</th>
                      <th className="py-3 px-4 font-semibold">Matricule</th>
                      <th className="py-3 px-4 font-semibold">
                        Classe / Section
                      </th>
                      <th className="py-3 px-4 font-semibold">
                        Parent & Contact
                      </th>
                      <th className="py-3 px-4 font-semibold text-center">
                        Statut
                      </th>
                      <th className="py-3 px-4 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredStudents.map((student) => {
                      const studentClass = classes.find(
                        (c) => c.id === student.classId,
                      );
                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          {/* Profile */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-indigo-50 text-indigo-700 font-bold rounded-lg flex items-center justify-center shrink-0">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-950">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-[11px] text-gray-400">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Roll number */}
                          <td className="py-3.5 px-4 font-mono font-medium text-gray-500">
                            {student.rollNumber}
                          </td>

                          {/* Class / Section */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-gray-900">
                                {studentClass ? studentClass.name : "Inconnu"}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                Section {student.section}
                              </span>
                            </div>
                          </td>

                          {/* Parent */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800">
                                {student.parentName}
                              </span>
                              <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <Phone className="h-3 w-3" />
                                {student.parentPhone}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                student.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {student.status === "Active"
                                ? "Actif"
                                : "Inactif"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingStudent(student)}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Voir la fiche"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(student)}
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Supprimer définitivement l'élève ${student.firstName} ${student.lastName} ?`,
                                    )
                                  ) {
                                    onDeleteStudent(student.id);
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <p className="text-gray-400 text-sm">
                  Aucun élève ne correspond à votre recherche ou vos filtres.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedClassId("all");
                    setSelectedStatus("all");
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-2 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="h-3 w-3" /> Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Student modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 overflow-y-auto max-h-[90vh]">
            <h3 className="text-md font-semibold text-gray-900 mb-4">
              {modalMode === "add"
                ? "Inscription d'un Nouvel Élève"
                : "Modifier la Fiche de l'Élève"}
            </h3>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              {/* Grid Section 1: Personal Details */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block mb-2.5">
                  Informations de l'élève
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Nom de famille
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Genre
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                      <option value="Other">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Matricule d'admission
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Adresse E-mail institutionnelle
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    placeholder="ex: prenom.nom@ecole.fr"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Classe d'affection
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    required
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Statut d'activité
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Active">Actif</option>
                    <option value="Inactive">Inactif</option>
                  </select>
                </div>
              </div>

              {/* Grid Section 2: Parents & Addresses */}
              <div className="pt-3 border-t border-gray-100">
                <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block mb-2.5">
                  Tuteur Légal & Contact d'urgence
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Nom complet du tuteur
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      placeholder="Mme ou M. ..."
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Téléphone portable
                    </label>
                    <input
                      type="text"
                      required
                      value={parentPhone}
                      placeholder="06 ..."
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Adresse postale
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    placeholder="Numéro, rue, code postal, ville"
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  {modalMode === "add"
                    ? "Confirmer l'inscription"
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
