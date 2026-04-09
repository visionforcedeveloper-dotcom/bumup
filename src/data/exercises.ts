import G from './gifAssets';

export type MuscleGroup = 'Glúteos' | 'Pernas' | 'Cardio';
export type Difficulty = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Exercise {
  id: string; name: string; muscleGroup: MuscleGroup;
  secondaryMuscles: string[]; difficulty: Difficulty;
  equipment: string; gifUrl: any;
  instructions: string[]; tips: string[];
  defaultSets: number; defaultReps: string; defaultRest: number;
}

export const exercises: Exercise[] = [
  {
    id:'gl001', name:'4 Apoios Cruzado Braços Estendidos', muscleGroup:'Glúteos',
    secondaryMuscles:['Core'], difficulty:'Intermediário', equipment:'Sem equipamento',
    gifUrl:G.quatro_apoios_cruzado,
    instructions:['Apoie mãos e joelhos no chão','Estenda o braço oposto à perna simultaneamente','Mantenha o core ativado e a coluna neutra','Retorne e alterne os lados'],
    tips:['Não deixe o quadril girar','Movimento lento e controlado'],
    defaultSets:3, defaultReps:'12-15', defaultRest:45
  },
  {
    id:'gl002', name:'Abdução Flexionado', muscleGroup:'Glúteos',
    secondaryMuscles:['Pernas'], difficulty:'Iniciante', equipment:'Sem equipamento',
    gifUrl:G.abducao_flexionado,
    instructions:['Deite de lado com joelhos flexionados','Abra o joelho de cima como uma concha','Mantenha os pés juntos','Retorne controlado'],
    tips:['Foco no glúteo médio','Não deixe o quadril rolar para trás'],
    defaultSets:3, defaultReps:'15-20', defaultRest:45
  },
  {
    id:'gl003', name:'3 Apoios Alto', muscleGroup:'Glúteos',
    secondaryMuscles:['Core'], difficulty:'Iniciante', equipment:'Sem equipamento',
    gifUrl:G.tres_apoios_alto,
    instructions:['Apoie mãos e joelhos no chão','Estenda uma perna para trás e para cima','Mantenha o quadril nivelado','Retorne e repita'],
    tips:['Contraia o glúteo no topo','Não arqueje a lombar'],
    defaultSets:3, defaultReps:'15-20', defaultRest:45
  },
  {
    id:'gl004', name:'4 Apoios Cachorrinho', muscleGroup:'Glúteos',
    secondaryMuscles:['Pernas','Core'], difficulty:'Iniciante', equipment:'Sem equipamento',
    gifUrl:G.quatro_apoios_cachorro,
    instructions:['Apoie mãos e joelhos no chão','Eleve o joelho lateralmente mantendo-o flexionado','Leve o joelho em direção ao cotovelo','Retorne controlado'],
    tips:['Mantenha o core ativado','Não gire o tronco'],
    defaultSets:3, defaultReps:'15-20', defaultRest:45
  },
  {
    id:'gl005', name:'Agachamento com Flexão Plantar Uni', muscleGroup:'Glúteos',
    secondaryMuscles:['Pernas'], difficulty:'Intermediário', equipment:'Sem equipamento',
    gifUrl:G.agachamento_flexao,
    instructions:['Fique em pé com os pés na largura dos ombros','Agache até as coxas ficarem paralelas ao chão','Ao subir, eleve os calcanhares (flexão plantar)','Retorne à posição inicial'],
    tips:['Mantenha o joelho alinhado com o pé','Ativa glúteo e panturrilha juntos'],
    defaultSets:3, defaultReps:'12-15', defaultRest:60
  },
  {
    id:'gl006', name:'Contração de Quadril', muscleGroup:'Glúteos',
    secondaryMuscles:[], difficulty:'Iniciante', equipment:'Sem equipamento',
    gifUrl:G.contracao_quadril,
    instructions:['Deite de costas com joelhos flexionados','Eleve o quadril contraindo os glúteos','Segure 2 segundos no topo','Desça controlado'],
    tips:['Ótimo exercício de ativação','Pode adicionar banda de resistência'],
    defaultSets:3, defaultReps:'20-25', defaultRest:45
  },
  {
    id:'gl007', name:'Elevação Pélvica Unilateral', muscleGroup:'Glúteos',
    secondaryMuscles:['Pernas'], difficulty:'Intermediário', equipment:'Sem equipamento',
    gifUrl:G.elevacao_pelvica_uni,
    instructions:['Deite de costas, uma perna estendida no ar','Eleve o quadril com a perna de apoio','Segure no topo contraindo o glúteo','Desça controlado'],
    tips:['Maior ativação unilateral','Mantenha a perna elevada estendida'],
    defaultSets:3, defaultReps:'10-12', defaultRest:60
  },
  {
    id:'gl008', name:'Flexão Alta', muscleGroup:'Glúteos',
    secondaryMuscles:['Pernas','Core'], difficulty:'Intermediário', equipment:'Sem equipamento',
    gifUrl:G.flexao_alta,
    instructions:['Em posição de prancha alta','Eleve uma perna para cima mantendo o joelho estendido','Contraia o glúteo no topo','Retorne e alterne'],
    tips:['Mantenha o core firme','Não deixe o quadril cair'],
    defaultSets:3, defaultReps:'12-15', defaultRest:45
  },
  {
    id:'gl009', name:'Glúteo Abduzido', muscleGroup:'Glúteos',
    secondaryMuscles:[], difficulty:'Iniciante', equipment:'Sem equipamento',
    gifUrl:G.gluteo_abduzido,
    instructions:['Fique em pé com apoio','Eleve a perna lateralmente com o pé em flexão','Contraia o glúteo médio no topo','Retorne controlado'],
    tips:['Foco no glúteo médio','Movimento lento e controlado'],
    defaultSets:3, defaultReps:'15-20', defaultRest:45
  },
  {
    id:'gl010', name:'Sumô Estático com Flexão Plantar', muscleGroup:'Glúteos',
    secondaryMuscles:['Pernas'], difficulty:'Intermediário', equipment:'Sem equipamento',
    gifUrl:G.sumo_flexao_plantar,
    instructions:['Pés afastados além da largura dos ombros, pontas para fora','Agache em posição sumô e segure','Eleve os calcanhares alternadamente','Mantenha o agachamento durante todo o exercício'],
    tips:['Ativa glúteo e panturrilha','Mantenha o peito erguido'],
    defaultSets:3, defaultReps:'12-15', defaultRest:60
  },
  {
    id:'gl011', name:'Sumô Pés em Abdução', muscleGroup:'Glúteos',
    secondaryMuscles:['Pernas'], difficulty:'Iniciante', equipment:'Sem equipamento',
    gifUrl:G.sumo_abducao,
    instructions:['Pés bem afastados com pontas para fora','Desça em agachamento sumô profundo','Suba empurrando o chão com os calcanhares','Contraia os glúteos no topo'],
    tips:['Quanto mais afastados os pés, mais glúteo','Joelhos seguem a direção dos pés'],
    defaultSets:4, defaultReps:'15-20', defaultRest:60
  },
];

export const workoutPlans = [
  {
    id:'plan001', name:'Bumbum do Zero', description:'Ativação e fortalecimento dos glúteos para iniciantes, sem equipamento',
    duration:'4 semanas', level:'Iniciante' as Difficulty, daysPerWeek:3,
    category:'Iniciante', color:'#D96B9E',
    exercises:['gl006','gl003','gl002','gl009']
  },
  {
    id:'plan002', name:'Glúteo Máximo', description:'Protocolo completo para hipertrofia e definição dos glúteos',
    duration:'8 semanas', level:'Intermediário' as Difficulty, daysPerWeek:4,
    category:'Hipertrofia', color:'#B57BEA',
    exercises:['gl007','gl001','gl008','gl005']
  },
  {
    id:'plan003', name:'Bumbum em Casa', description:'Treino completo de glúteos sem equipamentos, para qualquer lugar',
    duration:'6 semanas', level:'Iniciante' as Difficulty, daysPerWeek:4,
    category:'Casa', color:'#F4845F',
    exercises:['gl006','gl004','gl011','gl003']
  },
  {
    id:'plan004', name:'Glúteo Funcional', description:'Exercícios funcionais que trabalham glúteo, core e equilíbrio juntos',
    duration:'6 semanas', level:'Intermediário' as Difficulty, daysPerWeek:3,
    category:'Funcional', color:'#89A8E0',
    exercises:['gl001','gl010','gl008','gl005']
  },
];

export const weeklySchedule = [
  { day:'Seg', workout:'Glúteo Máximo', completed:true },
  { day:'Ter', workout:'Descanso', completed:false, isRest:true },
  { day:'Qua', workout:'Glúteo Funcional', completed:true },
  { day:'Qui', workout:'Descanso', completed:false, isRest:true },
  { day:'Sex', workout:'Bumbum Completo', completed:false },
  { day:'Sáb', workout:'Cardio Leve', completed:false },
  { day:'Dom', workout:'Descanso', completed:false, isRest:true },
];