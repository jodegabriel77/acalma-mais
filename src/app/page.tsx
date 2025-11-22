"use client";

import { useState, useEffect } from "react";
import { Heart, Wind, Brain, BookOpen, Trophy, Sparkles, Users, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type Mood = "muito-bem" | "bem" | "neutro" | "ansioso" | "mal" | null;

interface MoodEntry {
  date: string;
  mood: Mood;
  score: number;
}

export default function Home() {
  const [currentMood, setCurrentMood] = useState<Mood>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Carregar histórico do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("acalma-mood-history");
    if (saved) {
      setMoodHistory(JSON.parse(saved));
    }
    
    // Verificar se já registrou humor hoje
    const today = new Date().toDateString();
    const savedToday = localStorage.getItem("acalma-mood-today");
    if (savedToday === today) {
      const savedMood = localStorage.getItem("acalma-current-mood") as Mood;
      setCurrentMood(savedMood);
      setShowRecommendations(true);
    }
  }, []);

  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);
    setShowRecommendations(true);
    
    // Salvar no localStorage
    const today = new Date().toDateString();
    localStorage.setItem("acalma-mood-today", today);
    localStorage.setItem("acalma-current-mood", mood || "");
    
    // Adicionar ao histórico
    const moodScore = {
      "muito-bem": 5,
      "bem": 4,
      "neutro": 3,
      "ansioso": 2,
      "mal": 1,
    }[mood || "neutro"];
    
    const newEntry: MoodEntry = {
      date: today,
      mood,
      score: moodScore,
    };
    
    const updatedHistory = [...moodHistory.filter(e => e.date !== today), newEntry];
    setMoodHistory(updatedHistory);
    localStorage.setItem("acalma-mood-history", JSON.stringify(updatedHistory));
  };

  const getMoodEmoji = (mood: Mood) => {
    const emojis = {
      "muito-bem": "😊",
      "bem": "🙂",
      "neutro": "😐",
      "ansioso": "😰",
      "mal": "😔",
    };
    return mood ? emojis[mood] : "";
  };

  const getRecommendations = () => {
    const recommendations = {
      "muito-bem": {
        title: "Você está ótimo!",
        message: "Continue cultivando esse bem-estar",
        actions: [
          { icon: Brain, label: "Meditação de Gratidão", duration: "10 min" },
          { icon: BookOpen, label: "Diário de Conquistas", duration: "5 min" },
          { icon: Trophy, label: "Desafio do Dia", duration: "Rápido" },
        ],
      },
      "bem": {
        title: "Ótimo dia!",
        message: "Mantenha esse equilíbrio emocional",
        actions: [
          { icon: Brain, label: "Meditação de Foco", duration: "10 min" },
          { icon: Wind, label: "Respiração Energizante", duration: "3 min" },
          { icon: BookOpen, label: "Registrar Momento", duration: "5 min" },
        ],
      },
      "neutro": {
        title: "Dia tranquilo",
        message: "Que tal adicionar mais leveza?",
        actions: [
          { icon: Wind, label: "Respiração Relaxante", duration: "5 min" },
          { icon: Brain, label: "Meditação Guiada", duration: "10 min" },
          { icon: Heart, label: "Sons da Natureza", duration: "Livre" },
        ],
      },
      "ansioso": {
        title: "Vamos acalmar juntos",
        message: "Você não está sozinho nessa",
        actions: [
          { icon: AlertCircle, label: "SOS Ansiedade", duration: "Agora", urgent: true },
          { icon: Wind, label: "Respiração 4-7-8", duration: "3 min" },
          { icon: Heart, label: "Sons Relaxantes", duration: "Livre" },
        ],
      },
      "mal": {
        title: "Estamos aqui por você",
        message: "Pequenos passos fazem diferença",
        actions: [
          { icon: AlertCircle, label: "SOS Ansiedade", duration: "Agora", urgent: true },
          { icon: Wind, label: "Respiração Guiada", duration: "5 min" },
          { icon: Users, label: "Comunidade de Apoio", duration: "Livre" },
        ],
      },
    };
    
    return currentMood ? recommendations[currentMood] : null;
  };

  const calculateAverageScore = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.score, 0);
    return Math.round((sum / moodHistory.length) * 20);
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                Acalma+
              </h1>
              <p className="text-blue-100 text-sm mt-1">Seu refúgio de paz e bem-estar</p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Premium
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard">Início</TabsTrigger>
            <TabsTrigger value="sos">SOS</TabsTrigger>
            <TabsTrigger value="meditation">Meditar</TabsTrigger>
            <TabsTrigger value="diary">Diário</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Mood Check */}
            {!showRecommendations ? (
              <Card className="border-2 border-purple-200 shadow-xl bg-white/80 backdrop-blur">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-purple-900">Como você está se sentindo hoje?</CardTitle>
                  <CardDescription className="text-base">
                    Seu registro diário nos ajuda a personalizar sua experiência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { mood: "muito-bem" as Mood, label: "Muito Bem", emoji: "😊", color: "from-green-400 to-emerald-500" },
                      { mood: "bem" as Mood, label: "Bem", emoji: "🙂", color: "from-blue-400 to-cyan-500" },
                      { mood: "neutro" as Mood, label: "Neutro", emoji: "😐", color: "from-gray-400 to-slate-500" },
                      { mood: "ansioso" as Mood, label: "Ansioso", emoji: "😰", color: "from-orange-400 to-amber-500" },
                      { mood: "mal" as Mood, label: "Mal", emoji: "😔", color: "from-red-400 to-rose-500" },
                    ].map((item) => (
                      <Button
                        key={item.mood}
                        onClick={() => handleMoodSelect(item.mood)}
                        className={`h-24 flex flex-col gap-2 bg-gradient-to-br ${item.color} hover:scale-105 transition-transform shadow-lg text-white border-0`}
                      >
                        <span className="text-3xl">{item.emoji}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Current Mood Display */}
                <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Humor de Hoje</CardTitle>
                        <CardDescription>
                          {new Date().toLocaleDateString("pt-BR", { 
                            weekday: "long", 
                            day: "numeric", 
                            month: "long" 
                          })}
                        </CardDescription>
                      </div>
                      <div className="text-5xl">{getMoodEmoji(currentMood)}</div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Recommendations */}
                {recommendations && (
                  <Card className="border-2 border-blue-200 shadow-xl bg-white/80 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-purple-900">{recommendations.title}</CardTitle>
                      <CardDescription className="text-base">{recommendations.message}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {recommendations.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.urgent ? "default" : "outline"}
                          className={`w-full justify-start h-auto py-4 ${
                            action.urgent 
                              ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 shadow-lg animate-pulse" 
                              : "border-purple-200 hover:bg-purple-50"
                          }`}
                        >
                          <action.icon className="w-5 h-5 mr-3" />
                          <div className="flex-1 text-left">
                            <div className="font-semibold">{action.label}</div>
                            <div className="text-xs opacity-70">{action.duration}</div>
                          </div>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Progress Overview */}
                <Card className="border-2 border-green-200 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-900">
                      <TrendingUp className="w-5 h-5" />
                      Sua Evolução
                    </CardTitle>
                    <CardDescription>Últimos 7 dias</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Bem-estar geral</span>
                        <span className="font-semibold text-green-700">{calculateAverageScore()}%</span>
                      </div>
                      <Progress value={calculateAverageScore()} className="h-3" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{moodHistory.length}</div>
                        <div className="text-xs text-gray-600">Registros</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-xs text-gray-600">Meditações</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">5</div>
                        <div className="text-xs text-gray-600">Desafios</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* SOS Tab */}
          <TabsContent value="sos" className="space-y-4">
            <Card className="border-2 border-red-200 shadow-xl bg-gradient-to-br from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-2xl text-red-900 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  SOS Ansiedade
                </CardTitle>
                <CardDescription className="text-base">
                  Ferramentas rápidas para acalmar em momentos de crise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full h-20 text-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg">
                  <Wind className="w-6 h-6 mr-3" />
                  Respiração 4-7-8 (Emergência)
                </Button>
                <Button variant="outline" className="w-full h-16 border-2 border-orange-300 hover:bg-orange-50">
                  <Brain className="w-5 h-5 mr-3" />
                  Técnica 5-4-3-2-1 (Grounding)
                </Button>
                <Button variant="outline" className="w-full h-16 border-2 border-blue-300 hover:bg-blue-50">
                  <Heart className="w-5 h-5 mr-3" />
                  Sons Relaxantes
                </Button>
                <Button variant="outline" className="w-full h-16 border-2 border-purple-300 hover:bg-purple-50">
                  <Sparkles className="w-5 h-5 mr-3" />
                  Áudio de Emergência
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 shadow-xl bg-white/80">
              <CardHeader>
                <CardTitle className="text-lg">Dica Rápida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Respiração 4-7-8:</strong> Inspire por 4 segundos, segure por 7, expire por 8. 
                  Repita 4 vezes. Esta técnica ativa seu sistema nervoso parassimpático, promovendo calma imediata.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meditation Tab */}
          <TabsContent value="meditation" className="space-y-4">
            <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Meditações Guiadas
                </CardTitle>
                <CardDescription className="text-base">
                  Escolha a duração ideal para o seu momento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { duration: "5 min", title: "Pausa Rápida", desc: "Para momentos corridos", color: "from-green-400 to-emerald-500" },
                  { duration: "10 min", title: "Equilíbrio", desc: "Meditação completa", color: "from-blue-400 to-cyan-500" },
                  { duration: "20 min", title: "Imersão Profunda", desc: "Relaxamento total", color: "from-purple-400 to-pink-500" },
                ].map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full h-20 justify-start border-2 hover:scale-102 transition-transform bg-gradient-to-r ${item.color} text-white border-0 shadow-lg`}
                  >
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg">{item.title}</div>
                      <div className="text-sm opacity-90">{item.desc} • {item.duration}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200 shadow-xl bg-white/80">
              <CardHeader>
                <CardTitle className="text-lg">Categorias</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {["Ansiedade", "Sono", "Foco", "Relaxamento"].map((cat) => (
                  <Button key={cat} variant="outline" className="h-16 border-purple-200 hover:bg-purple-50">
                    {cat}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diary Tab */}
          <TabsContent value="diary" className="space-y-4">
            <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Diário Emocional
                </CardTitle>
                <CardDescription className="text-base">
                  Registre seus sentimentos e acompanhe sua jornada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg text-white">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Nova Entrada no Diário
                </Button>

                <div className="space-y-3 pt-4">
                  <h3 className="font-semibold text-gray-700">Entradas Recentes</h3>
                  {moodHistory.slice(-3).reverse().map((entry, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                          <div>
                            <div className="font-medium text-gray-900">
                              {new Date(entry.date).toLocaleDateString("pt-BR", { 
                                day: "numeric", 
                                month: "short" 
                              })}
                            </div>
                            <div className="text-sm text-gray-600">
                              {entry.mood === "muito-bem" && "Muito bem"}
                              {entry.mood === "bem" && "Bem"}
                              {entry.mood === "neutro" && "Neutro"}
                              {entry.mood === "ansioso" && "Ansioso"}
                              {entry.mood === "mal" && "Mal"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-200 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="grid grid-cols-5 gap-2">
            {[
              { icon: Heart, label: "Início", tab: "dashboard" },
              { icon: AlertCircle, label: "SOS", tab: "sos" },
              { icon: Brain, label: "Meditar", tab: "meditation" },
              { icon: BookOpen, label: "Diário", tab: "diary" },
              { icon: Trophy, label: "Desafios", tab: "challenges" },
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-colors ${
                  activeTab === item.tab
                    ? "text-purple-600 bg-purple-50"
                    : "text-gray-600 hover:text-purple-500"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
