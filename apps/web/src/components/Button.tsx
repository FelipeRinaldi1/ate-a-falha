interface StatusBadgeProps {
	status: 'active' | 'inactive'
}
export function StatusBadge({ status }: StatusBadgeProps) {
	const colors = {
		active: 'green',
		inactive: 'purple',
	}
	const button = <button style={{ backgroundColor: colors[status] }}>{status}</button>

	return <div>{button}</div>
}
