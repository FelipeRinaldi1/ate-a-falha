import { useState } from 'react'

export function UseStateEx() {
	const [count, setCount] = useState(0)

	return (
		<div>
			<p>Contador: {count}</p>
			<button
				onClick={() => {
					setCount(count + 1)
				}}
			>
				Incrementar
			</button>
		</div>
	)
}
