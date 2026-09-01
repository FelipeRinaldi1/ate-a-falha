import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../client.js'
import { GENDER, ROLE, WORKOUT_DAY, NOTIFICATION_TYPE } from '../generated/prisma/client.js'

export async function seedDemoUser() {
	console.log('--- Iniciando Seed de Usuário Completo ---')

	const demoEmail = 'demo@ateafalha.com.br'
	const demoPasswordPlain = 'Senha123!'
	const passwordHash = bcrypt.hashSync(demoPasswordPlain, 10)

	// 1. Limpeza de usuário anterior com mesmo e-mail para garantir idempotência
	const existingAuth = await prisma.auth.findUnique({
		where: { email: demoEmail },
		include: { user: true },
	})

	if (existingAuth) {
		console.log(`Limpando dados anteriores do usuário demo (${demoEmail})...`)
		await prisma.user.delete({
			where: { id: existingAuth.userId },
		})
	}

	// 2. Criação do Usuário e Registro de Autenticação
	console.log('Criando usuário e credenciais...')
	const user = await prisma.user.create({
		data: {
			name: 'Felipe Rinaldi',
			birthDate: new Date('1998-05-15'),
			gender: GENDER.MALE,
			role: ROLE.USER,
			auth: {
				create: {
					email: demoEmail,
					password: passwordHash,
				},
			},
		},
	})

	console.log(`Usuário criado: ${user.name} (ID: ${user.id}) | Email: ${demoEmail} | Senha: ${demoPasswordPlain}`)

	// 3. Criação do Histórico de Métricas Corporais (Evolução ao longo do tempo)
	console.log('Registrando histórico de evolução de métricas corporais...')
	const now = new Date()
	const daysAgo = (days: number) => {
		const d = new Date(now)
		d.setDate(d.getDate() - days)
		return d
	}

	const metricsData = [
		{
			weight: 84.5,
			height: 178,
			activityLevel: 3,
			bodyFat: 21.0,
			muscleRate: 37.5,
			bmi: 26.67,
			bmr: 1845,
			tdee: 2535,
			createdAt: daysAgo(60),
		},
		{
			weight: 83.0,
			height: 178,
			activityLevel: 3,
			bodyFat: 19.5,
			muscleRate: 38.5,
			bmi: 26.2,
			bmr: 1825,
			tdee: 2510,
			createdAt: daysAgo(45),
		},
		{
			weight: 81.2,
			height: 178,
			activityLevel: 4,
			bodyFat: 17.8,
			muscleRate: 39.8,
			bmi: 25.63,
			bmr: 1805,
			tdee: 2617,
			createdAt: daysAgo(30),
		},
		{
			weight: 79.6,
			height: 178,
			activityLevel: 4,
			bodyFat: 16.0,
			muscleRate: 40.7,
			bmi: 25.12,
			bmr: 1785,
			tdee: 2588,
			createdAt: daysAgo(15),
		},
		{
			weight: 78.5,
			height: 178,
			activityLevel: 4,
			bodyFat: 14.5,
			muscleRate: 41.5,
			bmi: 24.78,
			bmr: 1770,
			tdee: 2566,
			createdAt: now,
		},
	]

	for (const metric of metricsData) {
		await prisma.bodyMetric.create({
			data: {
				...metric,
				userId: user.id,
			},
		})
	}
	console.log(`Criados ${metricsData.length} registros de métricas corporais.`)

	// 4. Criação de Alimentos Personalizados do Usuário
	console.log('Criando alimentos personalizados...')
	const foodWhey = await prisma.food.create({
		data: {
			name: 'Whey Protein Isolado 90% (Dux)',
			calories: 110,
			protein: 27,
			carbohydrate: 1.5,
			lipids: 0.5,
			fiber: 0,
			userId: user.id,
		},
	})

	const foodPastaAmendoim = await prisma.food.create({
		data: {
			name: 'Pasta de Amendoim Integral Dr. Peanut',
			calories: 590,
			protein: 28,
			carbohydrate: 18,
			lipids: 48,
			fiber: 6.5,
			userId: user.id,
		},
	})

	await prisma.food.create({
		data: {
			name: 'Creatina Monohidratada Creapure',
			calories: 0,
			protein: 0,
			carbohydrate: 0,
			lipids: 0,
			fiber: 0,
			userId: user.id,
		},
	})

	const foodIogurte = await prisma.food.create({
		data: {
			name: 'Iogurte Natural Desnatado Nestlé',
			calories: 41,
			protein: 4.6,
			carbohydrate: 5.8,
			lipids: 0.3,
			fiber: 0,
			userId: user.id,
		},
	})

	// 5. Busca ou Criação de Alimentos Base para a Dieta
	const findOrCreateFood = async (name: string, fallback: { calories: number; protein: number; carbohydrate: number; lipids: number; fiber: number }) => {
		const found = await prisma.food.findFirst({
			where: {
				name: { contains: name, mode: 'insensitive' },
			},
		})
		if (found) return found

		return await prisma.food.create({
			data: {
				name,
				...fallback,
				userId: null,
			},
		})
	}

	const foodOvo = await findOrCreateFood('Ovo, de galinha, inteiro, cozido', { calories: 146, protein: 13.3, carbohydrate: 0.6, lipids: 9.5, fiber: 0 })
	const foodPao = await findOrCreateFood('Pão, trigo, forma, integral', { calories: 253, protein: 9.4, carbohydrate: 49.9, lipids: 3.7, fiber: 6.9 })
	const foodBanana = await findOrCreateFood('Banana, prata, crua', { calories: 98, protein: 1.3, carbohydrate: 26.0, lipids: 0.1, fiber: 2.0 })
	const foodAveia = await findOrCreateFood('Aveia, flocos', { calories: 394, protein: 13.9, carbohydrate: 66.6, lipids: 8.5, fiber: 9.1 })
	const foodArroz = await findOrCreateFood('Arroz, tipo 1, cozido', { calories: 128, protein: 2.5, carbohydrate: 28.1, lipids: 0.2, fiber: 1.6 })
	const foodFeijao = await findOrCreateFood('Feijão, carioca, cozido', { calories: 76, protein: 4.8, carbohydrate: 13.6, lipids: 0.5, fiber: 8.5 })
	const foodFrango = await findOrCreateFood('Frango, peito, sem pele, grelhado', { calories: 159, protein: 32.0, carbohydrate: 0, lipids: 2.5, fiber: 0 })
	const foodBatataDoce = await findOrCreateFood('Batata, doce, cozida', { calories: 77, protein: 0.6, carbohydrate: 18.4, lipids: 0.1, fiber: 2.2 })
	const foodCarne = await findOrCreateFood('Carne, bovina, patinho, sem gordura, grelhado', { calories: 219, protein: 35.9, carbohydrate: 0, lipids: 7.3, fiber: 0 })
	const foodAzeite = await findOrCreateFood('Azeite, de oliva, extra virgem', { calories: 884, protein: 0, carbohydrate: 0, lipids: 100, fiber: 0 })

	// 6. Criação de Dieta Completa com 5 Refeições Estruturadas
	console.log('Criando plano de dieta e refeições estruturadas...')
	const diet = await prisma.diet.create({
		data: {
			name: 'Dieta de Hipertrofia Limpa (Lean Bulk)',
			dailyKcalGoal: 2550,
			dailyProteinGoal: 180,
			dailyCarbGoal: 300,
			dailyFatGoal: 65,
			dailyFiberGoal: 32,
			dailyWaterGoal: 3500,
			dailyWater: 2750,
			isExported: false,
			userId: user.id,
			meals: {
				create: [
					{
						name: 'Café da Manhã',
						time: '07:30',
						orderIndex: 0,
						foods: {
							create: [
								{ foodId: foodOvo.id, quantity: 150 },
								{ foodId: foodPao.id, quantity: 50 },
								{ foodId: foodBanana.id, quantity: 100 },
							],
						},
					},
					{
						name: 'Almoço Completo',
						time: '12:30',
						orderIndex: 1,
						foods: {
							create: [
								{ foodId: foodArroz.id, quantity: 200 },
								{ foodId: foodFeijao.id, quantity: 100 },
								{ foodId: foodFrango.id, quantity: 180 },
								{ foodId: foodAzeite.id, quantity: 10 },
							],
						},
					},
					{
						name: 'Lanche Pré-Treino',
						time: '16:00',
						orderIndex: 2,
						foods: {
							create: [
								{ foodId: foodAveia.id, quantity: 50 },
								{ foodId: foodBanana.id, quantity: 120 },
								{ foodId: foodWhey.id, quantity: 30 },
							],
						},
					},
					{
						name: 'Jantar Pós-Treino',
						time: '20:00',
						orderIndex: 3,
						foods: {
							create: [
								{ foodId: foodBatataDoce.id, quantity: 250 },
								{ foodId: foodCarne.id, quantity: 180 },
								{ foodId: foodAzeite.id, quantity: 8 },
							],
						},
					},
					{
						name: 'Ceia',
						time: '22:30',
						orderIndex: 4,
						foods: {
							create: [
								{ foodId: foodPastaAmendoim.id, quantity: 20 },
								{ foodId: foodIogurte.id, quantity: 160 },
							],
						},
					},
				],
			},
		},
	})
	console.log(`Dieta criada: ${diet.name} com 5 refeições configuradas.`)

	// 7. Criação de Logs Diários de Alimentação (DietLog)
	console.log('Criando logs diários de refeições e hidratação...')
	const logDates = [daysAgo(2), daysAgo(1), now]
	for (const date of logDates) {
		const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
		await prisma.dietLog.create({
			data: {
				userId: user.id,
				date: normalizedDate,
				waterIntake: 3200,
				meals: {
					create: [
						{
							name: 'Café da Manhã',
							time: '07:30',
							orderIndex: 0,
							foods: {
								create: [
									{ foodId: foodOvo.id, quantity: 150 },
									{ foodId: foodPao.id, quantity: 50 },
								],
							},
						},
						{
							name: 'Almoço',
							time: '12:30',
							orderIndex: 1,
							foods: {
								create: [
									{ foodId: foodArroz.id, quantity: 200 },
									{ foodId: foodFrango.id, quantity: 180 },
								],
							},
						},
						{
							name: 'Lanche Pré-Treino',
							time: '16:00',
							orderIndex: 2,
							foods: {
								create: [
									{ foodId: foodAveia.id, quantity: 50 },
									{ foodId: foodWhey.id, quantity: 30 },
								],
							},
						},
						{
							name: 'Jantar',
							time: '20:15',
							orderIndex: 3,
							foods: {
								create: [
									{ foodId: foodBatataDoce.id, quantity: 200 },
									{ foodId: foodCarne.id, quantity: 160 },
								],
							},
						},
					],
				},
			},
		})
	}

	// 8. Busca ou Criação de Exercícios para o Módulo de Treinos
	console.log('Configurando exercícios do plano de treino...')
	const findOrCreateExercise = async (name: string, externalId: string, primaryMuscles: string[], category = 'forca') => {
		const found = await prisma.exercise.findFirst({
			where: {
				OR: [
					{ name: { contains: name, mode: 'insensitive' } },
					{ externalId: externalId },
				],
			},
		})
		if (found) return found

		return await prisma.exercise.create({
			data: {
				externalId,
				name,
				category,
				primaryMuscles,
				secondaryMuscles: [],
				instructions: [
					'Posicione-se adequadamente no aparelho ou banco.',
					'Execute o movimento mantendo controle excêntrico e concêntrico.',
					'Mantenha a postura e expire na fase de esforço.',
				],
				images: [],
			},
		})
	}

	const exSupino = await findOrCreateExercise('Supino Reto com Barra', 'Barbell_Bench_Press', ['peito'])
	const exInclinado = await findOrCreateExercise('Supino Inclinado com Halteres', 'Incline_Dumbbell_Press', ['peito', 'ombros'])
	const exDesenv = await findOrCreateExercise('Desenvolvimento Militar com Halteres', 'Dumbbell_Shoulder_Press', ['ombros'])
	const exElevLateral = await findOrCreateExercise('Elevação Lateral', 'Side_Lateral_Raise', ['ombros'])
	const exTricepsPolia = await findOrCreateExercise('Tríceps Pulley na Corda', 'Triceps_Pushdown_Rope', ['triceps'])

	const exPuxada = await findOrCreateExercise('Puxada Frontal na Polia Alta', 'Lat_Pulldown', ['costas'])
	const exRemada = await findOrCreateExercise('Remada Curvada com Barra', 'Bent_Over_Barbell_Row', ['costas'])
	const exCrucifixoInv = await findOrCreateExercise('Crucifixo Inverso com Halteres', 'Rear_Delt_Raise', ['ombros', 'costas'])
	const exRoscaDireta = await findOrCreateExercise('Rosca Direta com Barra W', 'Barbell_Curl', ['biceps'])
	const exRoscaMartelo = await findOrCreateExercise('Rosca Martelo com Halteres', 'Hammer_Curls', ['biceps', 'antebraco'])

	const exAgachamento = await findOrCreateExercise('Agachamento Livre com Barra', 'Barbell_Squat', ['quadriceps', 'gluteos'])
	const exLegPress = await findOrCreateExercise('Leg Press 45 Graus', 'Leg_Press', ['quadriceps', 'gluteos'])
	const exExtensora = await findOrCreateExercise('Cadeira Extensora', 'Leg_Extensions', ['quadriceps'])
	const exFlexora = await findOrCreateExercise('Mesa Flexora', 'Lying_Leg_Curls', ['isquiotibiais'])
	const exPanturrilha = await findOrCreateExercise('Elevação de Panturrilha em Pé', 'Standing_Calf_Raises', ['panturrilhas'])
	const exAbdominal = await findOrCreateExercise('Abdominal Supra na Prancha', 'Decline_Crunch', ['abdominais'])

	// 9. Criação do Plano de Treino ABC Ativo
	console.log('Criando plano de treino ABC ativo...')
	const plan = await prisma.plan.create({
		data: {
			name: 'Plano ABC - Hipertrofia & Progressão de Carga',
			isActive: true,
			goal: 'hipertrofia',
			isExported: false,
			userId: user.id,
			workouts: {
				create: [
					{
						name: 'Treino A - Peito, Ombros e Tríceps',
						day: WORKOUT_DAY.A,
						weekDay: '1', // Segunda-feira
						workoutExercises: {
							create: [
								{
									exerciseId: exSupino.id,
									orderIndex: 0,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 12, weight: 60, restTimeSeconds: 90 },
											{ setNumber: 2, repetitions: 10, weight: 70, restTimeSeconds: 90 },
											{ setNumber: 3, repetitions: 8, weight: 80, restTimeSeconds: 90 },
											{ setNumber: 4, repetitions: 6, weight: 85, restTimeSeconds: 120 },
										],
									},
								},
								{
									exerciseId: exInclinado.id,
									orderIndex: 1,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 10, weight: 26, restTimeSeconds: 60 },
											{ setNumber: 2, repetitions: 10, weight: 28, restTimeSeconds: 60 },
											{ setNumber: 3, repetitions: 8, weight: 30, restTimeSeconds: 90 },
										],
									},
								},
								{
									exerciseId: exDesenv.id,
									orderIndex: 2,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 10, weight: 18, restTimeSeconds: 60 },
											{ setNumber: 2, repetitions: 10, weight: 20, restTimeSeconds: 60 },
											{ setNumber: 3, repetitions: 8, weight: 22, restTimeSeconds: 60 },
										],
									},
								},
								{
									exerciseId: exElevLateral.id,
									orderIndex: 3,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 15, weight: 10, restTimeSeconds: 45 },
											{ setNumber: 2, repetitions: 12, weight: 12, restTimeSeconds: 45 },
											{ setNumber: 3, repetitions: 12, weight: 12, restTimeSeconds: 45 },
											{ setNumber: 4, repetitions: 10, weight: 14, restTimeSeconds: 45 },
										],
									},
								},
								{
									exerciseId: exTricepsPolia.id,
									orderIndex: 4,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 12, weight: 25, restTimeSeconds: 45 },
											{ setNumber: 2, repetitions: 12, weight: 30, restTimeSeconds: 45 },
											{ setNumber: 3, repetitions: 10, weight: 35, restTimeSeconds: 45 },
										],
									},
								},
							],
						},
					},
					{
						name: 'Treino B - Dorsais, Deltoide Posterior e Bíceps',
						day: WORKOUT_DAY.B,
						weekDay: '3', // Quarta-feira
						workoutExercises: {
							create: [
								{
									exerciseId: exPuxada.id,
									orderIndex: 0,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 12, weight: 55, restTimeSeconds: 90 },
											{ setNumber: 2, repetitions: 10, weight: 65, restTimeSeconds: 90 },
											{ setNumber: 3, repetitions: 8, weight: 75, restTimeSeconds: 90 },
										],
									},
								},
								{
									exerciseId: exRemada.id,
									orderIndex: 1,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 10, weight: 50, restTimeSeconds: 90 },
											{ setNumber: 2, repetitions: 10, weight: 60, restTimeSeconds: 90 },
											{ setNumber: 3, repetitions: 8, weight: 70, restTimeSeconds: 90 },
										],
									},
								},
								{
									exerciseId: exCrucifixoInv.id,
									orderIndex: 2,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 12, weight: 12, restTimeSeconds: 60 },
											{ setNumber: 2, repetitions: 12, weight: 12, restTimeSeconds: 60 },
											{ setNumber: 3, repetitions: 10, weight: 14, restTimeSeconds: 60 },
										],
									},
								},
								{
									exerciseId: exRoscaDireta.id,
									orderIndex: 3,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 10, weight: 30, restTimeSeconds: 60 },
											{ setNumber: 2, repetitions: 10, weight: 34, restTimeSeconds: 60 },
											{ setNumber: 3, repetitions: 8, weight: 38, restTimeSeconds: 60 },
										],
									},
								},
								{
									exerciseId: exRoscaMartelo.id,
									orderIndex: 4,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 12, weight: 14, restTimeSeconds: 45 },
											{ setNumber: 2, repetitions: 10, weight: 16, restTimeSeconds: 45 },
											{ setNumber: 3, repetitions: 10, weight: 16, restTimeSeconds: 45 },
										],
									},
								},
							],
						},
					},
					{
						name: 'Treino C - Pernas Completo e Abdômen',
						day: WORKOUT_DAY.C,
						weekDay: '5', // Sexta-feira
						workoutExercises: {
							create: [
								{
									exerciseId: exAgachamento.id,
									orderIndex: 0,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 12, weight: 70, restTimeSeconds: 120 },
											{ setNumber: 2, repetitions: 10, weight: 90, restTimeSeconds: 120 },
											{ setNumber: 3, repetitions: 8, weight: 100, restTimeSeconds: 120 },
											{ setNumber: 4, repetitions: 6, weight: 110, restTimeSeconds: 150 },
										],
									},
								},
								{
									exerciseId: exLegPress.id,
									orderIndex: 1,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 12, weight: 180, restTimeSeconds: 90 },
											{ setNumber: 2, repetitions: 10, weight: 220, restTimeSeconds: 90 },
											{ setNumber: 3, repetitions: 8, weight: 250, restTimeSeconds: 90 },
										],
									},
								},
								{
									exerciseId: exExtensora.id,
									orderIndex: 2,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 12, weight: 50, restTimeSeconds: 60 },
											{ setNumber: 2, repetitions: 12, weight: 55, restTimeSeconds: 60 },
											{ setNumber: 3, repetitions: 10, weight: 60, restTimeSeconds: 60 },
										],
									},
								},
								{
									exerciseId: exFlexora.id,
									orderIndex: 3,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 12, weight: 40, restTimeSeconds: 60 },
											{ setNumber: 2, repetitions: 10, weight: 45, restTimeSeconds: 60 },
											{ setNumber: 3, repetitions: 10, weight: 45, restTimeSeconds: 60 },
										],
									},
								},
								{
									exerciseId: exPanturrilha.id,
									orderIndex: 4,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 15, weight: 60, restTimeSeconds: 45 },
											{ setNumber: 2, repetitions: 15, weight: 70, restTimeSeconds: 45 },
											{ setNumber: 3, repetitions: 12, weight: 80, restTimeSeconds: 45 },
										],
									},
								},
								{
									exerciseId: exAbdominal.id,
									orderIndex: 5,
									sets: {
										create: [
											{ setNumber: 1, repetitions: 20, weight: 0, restTimeSeconds: 45 },
											{ setNumber: 2, repetitions: 15, weight: 5, restTimeSeconds: 45 },
											{ setNumber: 3, repetitions: 15, weight: 5, restTimeSeconds: 45 },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	})
	console.log(`Plano de treino criado: ${plan.name} com 3 dias de treino (A, B, C) e 16 exercícios com séries completas.`)

	// 10. Criação de Notificações do Sistema para o Usuário
	console.log('Criando notificações de exemplo...')
	const notifications = [
		{
			title: 'Treino de Peito Concluído! 🔥',
			message: 'Você completou o Treino A com progressão de carga no supino (+5kg). Excelente trabalho!',
			type: NOTIFICATION_TYPE.WORKOUT,
			read: false,
			link: '/workout',
			userId: user.id,
		},
		{
			title: 'Meta de Hidratação Atingida 💧',
			message: 'Parabéns! Você atingiu sua meta diária de 3.500ml de água.',
			type: NOTIFICATION_TYPE.DIET,
			read: false,
			link: '/nutrition/diet',
			userId: user.id,
		},
		{
			title: 'Redução de Percentual de Gordura 📊',
			message: 'Sua última avaliação física registrou 14.5% de BF. Você está no caminho certo!',
			type: NOTIFICATION_TYPE.SUCCESS,
			read: false,
			link: '/user/metrics/evolution',
			userId: user.id,
		},
		{
			title: 'Lembrete de Refeição ⏰',
			message: 'Não se esqueça do seu Lanche Pré-Treino programado para as 16:00.',
			type: NOTIFICATION_TYPE.INFO,
			read: true,
			link: '/nutrition/diet',
			userId: user.id,
		},
		{
			title: 'Bem-vindo ao Até a Falha! 🚀',
			message: 'Sua conta está configurada com métricas, dieta personalizada e rotina de treinos.',
			type: NOTIFICATION_TYPE.SYSTEM,
			read: true,
			link: '/workout',
			userId: user.id,
		},
	]

	for (const notif of notifications) {
		await prisma.notification.create({
			data: notif,
		})
	}
	console.log(`Criadas ${notifications.length} notificações de exemplo.`)

	console.log('--- Seed de Usuário Demo Concluído com Sucesso! ---')
}

if (process.argv[1] && (process.argv[1].endsWith('user.seed.ts') || process.argv[1].endsWith('user.seed.js'))) {
	seedDemoUser()
		.catch((e) => {
			console.error(e)
			process.exit(1)
		})
		.finally(async () => {
			await prisma.$disconnect()
		})
}

