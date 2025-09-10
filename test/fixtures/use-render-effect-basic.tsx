import React, {useState, useEffect} from 'react';
import {
	render,
	Text,
	useApp,
	useStdout,
	useRenderEffect,
} from '../../src/index.js';

function UseRenderEffectBasic() {
	const [count, setCount] = useState(0);
	const {exit} = useApp();
	const {write} = useStdout();

	// Standard useEffect to trigger re-renders
	useEffect(() => {
		const interval = setInterval(() => {
			setCount(prev => prev + 1);
		}, 500);
		return () => {
			clearInterval(interval);
		};
	}, []);

	// UseRenderEffect that logs after each render is painted
	useRenderEffect(() => {
		if (count > 0) {
			write(`useRenderEffect called: count ${count}`);
		}

		if (count >= 3) {
			exit();
		}
	}, [count]);

	return <Text>Count: {count}</Text>;
}

const app = render(<UseRenderEffectBasic />);

await app.waitUntilExit();
console.log('exited');
