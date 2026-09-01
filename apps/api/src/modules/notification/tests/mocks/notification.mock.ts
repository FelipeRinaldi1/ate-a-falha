import { CreateNotificationDTO } from '@ate-a-falha/shared'

export const baseNotificationMock: CreateNotificationDTO = {
	title: 'Treino de Hoje',
	message: 'Seu treino A (Peito e Tríceps) está pronto para ser executado.',
	type: 'WORKOUT',
	link: '/workouts',
}

export const overrideNotificationMock = (
	overrides: Partial<CreateNotificationDTO> = {}
): CreateNotificationDTO => ({
	...baseNotificationMock,
	...overrides,
})
