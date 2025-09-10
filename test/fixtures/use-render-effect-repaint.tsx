import React, {useState, useEffect} from 'react';
import {
	render,
	Text,
	useApp,
	useRenderEffect,
	useStdout,
} from '../../src/index.js';

function UseRenderEffectRepaint() {
	const [count, setCount] = useState(0);
	const {exit} = useApp();
	const {write} = useStdout();

	// Trigger count changes
	useEffect(() => {
		if (count < 2) {
			const timer = setTimeout(() => {
				setCount(prev => prev + 1);
			}, 400);
			return () => {
				clearTimeout(timer);
			};
		}

		return undefined;
	}, [count]);

	// UseRenderEffect that modifies terminal output using ANSI escape sequences
	// This proves the effect runs AFTER the terminal has been painted
	useRenderEffect(() => {
		if (count > 0) {
			// Move cursor up one line and clear it, then write modified content
			write('\u001B[1A\u001B[2K');
			write(`MODIFIED BY EFFECT: Count ${count}\n`);
		}
	}, [count]);

	// Exit when done
	useEffect(() => {
		if (count >= 2) {
			setTimeout(() => {
				exit();
			}, 200);
		}

		return undefined;
	}, [count]);

	return <Text>Original: Count {count}</Text>;
}

const app = render(<UseRenderEffectRepaint />);

await app.waitUntilExit();
console.log('exited');
