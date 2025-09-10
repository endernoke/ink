import {useContext, useLayoutEffect, useRef, type DependencyList} from 'react';
import {InkContext} from '../components/InkContext.js';

/**
 * Runs an effect after the component is rendered and painted to the terminal.
 * Unlike useEffect, this hook ensures that the effect runs after the UI has been
 * actually flushed to the terminal output, not just after React's render phase.
 *
 * This is useful for actions that need to happen after the visual update is complete,
 * such as rendering custom output directly to the terminal.
 *
 * @param effect - The effect callback to run after render is painted
 * @param deps - Dependency array, similar to useEffect
 */
export default function useRenderEffect(
	effect: () => void | (() => void),
	deps?: DependencyList,
): void {
	const ink = useContext(InkContext);
	const cleanupRef = useRef<(() => void) | void>(undefined);

	if (!ink) {
		throw new Error(
			'useRenderEffect must be used within an Ink application. ' +
				'Make sure you are calling this hook inside a component that is rendered with Ink.',
		);
	}

	useLayoutEffect(() => {
		// Clean up previous effect if it returned a cleanup function
		if (cleanupRef.current) {
			cleanupRef.current();
			cleanupRef.current = undefined;
		}

		// Schedule the effect to run after the next render is painted
		ink.scheduleRenderEffect(() => {
			cleanupRef.current = effect();
		});

		// Return cleanup function for when component unmounts or deps change
		return () => {
			if (cleanupRef.current) {
				cleanupRef.current();
				cleanupRef.current = undefined;
			}
		};
	}, deps);
}
