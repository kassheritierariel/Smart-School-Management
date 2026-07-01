import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle2,
  Building2,
  Calendar,
  MessageCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { SchoolProfile } from "../types";

interface LandingPageViewProps {
  currentSchool?: SchoolProfile | null;
  onGetStarted: () => void;
}

const SLIDER_DATA = [
  {
    id: 1,
    title: "Gestion des Étudiants",
    description:
      "Centralisez les dossiers scolaires, suivez le parcours académique et gérez les inscriptions avec une fluidité exceptionnelle.",
    icon: <Users className="w-12 h-12 text-blue-500" />,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Suivi des Présences",
    description:
      "Enregistrement rapide des absences et retards, avec alertes automatiques envoyées aux parents pour un suivi proactif.",
    icon: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: 3,
    title: "Emploi du Temps",
    description:
      "Planification intelligente et dynamique des cours, gestion des salles et éviter les conflits d'horaires d'un simple clic.",
    icon: <Calendar className="w-12 h-12 text-amber-500" />,
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1722&q=80",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: 4,
    title: "Gestion des Enseignants",
    description:
      "Évaluez les performances, gérez les affectations, et simplifiez la collaboration entre le corps professoral.",
    icon: <BookOpen className="w-12 h-12 text-purple-500" />,
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 5,
    title: "Paiements Scolaires",
    description:
      "Suivi transparent des frais de scolarité, facturation automatisée, et relances douces pour une trésorerie saine.",
    icon: <Wallet className="w-12 h-12 text-rose-500" />,
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    color: "from-rose-400 to-red-500",
  },
  {
    id: 6,
    title: "Communication Parents-École",
    description:
      "Messagerie intégrée, annonces globales et accès instantané aux résultats pour une transparence totale.",
    icon: <MessageCircle className="w-12 h-12 text-cyan-500" />,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    color: "from-cyan-400 to-blue-500",
  },
];

export default function LandingPageView({ currentSchool, 
  onGetStarted,
}: LandingPageViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_DATA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % SLIDER_DATA.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + SLIDER_DATA.length) % SLIDER_DATA.length,
    );

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      {/* Header/Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl shadow-xs">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {currentSchool?.name || "Smart School Management"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onGetStarted}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block"
              >
                Connexion
              </button>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"
              >
                Accéder à la démo
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-linear-to-b from-blue-50/50 to-slate-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider mb-6">
              <Zap className="w-3 h-3" /> La nouvelle norme éducative
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
              L'excellence scolaire <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">
                à portée de main.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
              Une plateforme SaaS complète, sécurisée et intuitive pour
              moderniser l'administration de vos établissements et unifier la
              communauté éducative.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                Découvrir la plateforme
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Slider Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Fonctionnalités Clés
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Tout ce dont vous avez besoin pour gérer votre établissement
              scolaire, de l'inscription à la diplomation.
            </p>
          </div>

          <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[500px]">
              {/* Slider Content */}
              <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md"
                  >
                    <div
                      className={`inline-flex p-4 rounded-2xl mb-8 bg-gradient-to-br ${SLIDER_DATA[currentSlide].color} bg-opacity-10 shadow-inner`}
                    >
                      <div className="p-1 bg-white rounded-xl shadow-xs">
                        {SLIDER_DATA[currentSlide].icon}
                      </div>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
                      {SLIDER_DATA[currentSlide].title}
                    </h3>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
                      {SLIDER_DATA[currentSlide].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-auto">
                  <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {SLIDER_DATA.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-blue-600" : "w-2 bg-slate-200"}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Slider Image */}
              <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full overflow-hidden bg-slate-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={SLIDER_DATA[currentSlide].image}
                    alt={SLIDER_DATA[currentSlide].title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent lg:w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
                Conçu pour l'excellence opérationnelle.
              </h2>
              <p className="text-slate-300 font-medium text-lg mb-8 leading-relaxed">
                Notre architecture modulaire garantit une performance optimale
                et s'adapte à la croissance de votre institution, que vous
                gériez 100 ou 10,000 étudiants.
              </p>
              <div className="space-y-4">
                <BenefitItem
                  title="Déploiement Cloud Sécurisé"
                  text="Vos données sont chiffrées, sauvegardées quotidiennement et accessibles 24/7."
                />
                <BenefitItem
                  title="Authenticité Garantie (QR Codes)"
                  text="Validation des documents et cartes d'identité via QR codes uniques intégrés."
                />
                <BenefitItem
                  title="Interface Responsive"
                  text="Design adaptatif parfait sur ordinateur, tablette et smartphone."
                />
                <BenefitItem
                  title="Multi-Établissements"
                  text="Gérez plusieurs écoles avec des identités visuelles personnalisées (logos, en-têtes)."
                />
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80"
                  alt="Dashboard preview"
                  className="rounded-xl opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Journeys */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
              Parcours Utilisateurs Clés
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Une expérience sur-mesure pour chaque acteur de la vie scolaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <JourneyCard
              role="Super Administrateur"
              color="blue"
              icon={<ShieldCheck className="w-6 h-6" />}
              items={[
                "Création et configuration des écoles du groupe",
                "Personnalisation de l'identité visuelle par école",
                "Vision consolidée des finances et des effectifs",
                "Paramétrage des devises et taux de change",
              ]}
            />
            <JourneyCard
              role="Administration & Comptabilité"
              color="emerald"
              icon={<BarChart3 className="w-6 h-6" />}
              items={[
                "Émission de factures et reçus sécurisés par QR Code",
                "Facturation automatisée et relance des impayés",
                "Gestion des stocks, fournitures et uniformes",
                "Communication ciblée par SMS/Email/Interne",
              ]}
            />
            <JourneyCard
              role="Corps Enseignant"
              color="amber"
              icon={<BookOpen className="w-6 h-6" />}
              items={[
                "Saisie rapide des présences et des notes",
                "Génération des bulletins sécurisés avec QR Code",
                "Messagerie directe avec les élèves et parents",
                "Analyse des performances de la classe",
              ]}
            />
            <JourneyCard
              role="Élèves & Parents"
              color="indigo"
              icon={<Smartphone className="w-6 h-6" />}
              items={[
                "Consultation des résultats et bulletins",
                "Suivi des paiements et téléchargement des reçus",
                "Visualisation du planning et des annonces",
                "Cartes d'identité numériques sécurisées",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tight mb-6">
            Prêt à transformer votre école ?
          </h2>
          <p className="text-blue-100 text-xl font-medium mb-10">
            Rejoignez les institutions qui ont déjà modernisé leur gestion avec
            notre solution SaaS.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 hover:bg-slate-50 px-10 py-5 rounded-xl text-lg font-bold shadow-xl transition-all"
          >
            Commencer maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-center text-slate-400 font-medium text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5" />
          <span className="font-bold text-white">{currentSchool?.name || "Smart School Management"}</span>
        </div>
        <p>
          © {new Date().getFullYear()} {currentSchool?.name || "Smart School Management"}.  Tous droits
          réservés.
        </p>
      </footer>
    </div>
  );
}

function BenefitItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      </div>
      <div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function JourneyCard({
  role,
  color,
  icon,
  items,
}: {
  role: string;
  color: "blue" | "emerald" | "amber" | "indigo";
  icon: React.ReactNode;
  items: string[];
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorMap[color]}`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900">{role}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Zap
              className={`w-4 h-4 mt-0.5 shrink-0 ${colorMap[color].split(" ")[1]}`}
            />
            <span className="text-sm font-medium text-slate-600">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
