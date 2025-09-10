import React, {useState, useEffect} from 'react';
import {render, Text, useRenderEffect} from '../../src/index.js';

function UseRenderEffectExample() {
	const [count, setCount] = useState(0);
	const [effectCount, setEffectCount] = useState(0);
	const [renderEffectCount, setRenderEffectCount] = useState(0);

	// Standard useEffect - runs after React reconciliation but before painting
	useEffect(() => {
		console.log(`useEffect: count is now ${count}`);
		setEffectCount(previousCount => previousCount + 1);
	}, [count]);

	// Our new useRenderEffect - runs after painting to terminal
	useRenderEffect(() => {
		console.log(`useRenderEffect: count is now ${count} (after painting)`);
		setRenderEffectCount(previousCount => previousCount + 1);
	}, [count]);

	// Automatically increment count every 2 seconds
	useEffect(() => {
		const timer = setInterval(() => {
			setCount(previousCount => previousCount + 1);
		}, 2000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<Text>
			Count: {count} | useEffect calls: {effectCount} | useRenderEffect calls:{' '}
			{renderEffectCount}
		</Text>
	);
}

render(<UseRenderEffectExample />);
