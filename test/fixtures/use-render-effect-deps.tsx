import React, {useState, useEffect} from 'react';
import {
	render,
	Text,
	useApp,
	useStdout,
	useRenderEffect,
} from '../../src/index.js';

function UseRenderEffectDeps() {
	const [count, setCount] = useState(0);
	const [otherValue, setOtherValue] = useState(0);
	const {exit} = useApp();
	const {write} = useStdout();

	// Trigger count changes
	useEffect(() => {
		if (count < 2) {
			const timer = setTimeout(() => {
				setCount(prev => prev + 1);
			}, 300);
			return () => {
				clearTimeout(timer);
			};
		}

		return undefined;
	}, [count]);

	// Trigger otherValue changes (but not in dependency array)
	useEffect(() => {
		if (otherValue < 5 && count >= 1) {
			const timer = setTimeout(() => {
				setOtherValue(prev => prev + 1);
			}, 200);
			return () => {
				clearTimeout(timer);
			};
		}

		return undefined;
	}, [otherValue, count]);

	// UseRenderEffect that only depends on count, not otherValue
	useRenderEffect(() => {
		if (count > 0) {
			write(`useRenderEffect with deps: ${count}`);
		}
	}, [count]);

	// Exit when done
	useEffect(() => {
		if (count >= 2 && otherValue >= 5) {
			setTimeout(() => {
				exit();
			}, 100);
		}
	}, [count, otherValue]);

	return (
		<Text>
			Count: {count}, Other: {otherValue}
		</Text>
	);
}

const app = render(<UseRenderEffectDeps />);

await app.waitUntilExit();
console.log('exited');
