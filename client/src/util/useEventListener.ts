import { EventHandler, useRef, useEffect } from 'react';

export function useEventListener(
	eventName: string,
	handler: EventHandler<any>,
	element: any = window
) {
	const savedHandler = useRef<EventHandler<any>>();

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const isSupported = element && element.addEventListener;
		if (!isSupported) return;

		const eventListener = (event: any) => {
			if (savedHandler.current) {
				savedHandler.current(event);
			}
		};

		element.addEventListener(eventName, eventListener);

		return () => {
			element.removeEventListener(eventName, eventListener);
		};
	}, [eventName, element]);
}
