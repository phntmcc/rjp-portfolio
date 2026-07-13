"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type BodyPortalProps = {
	children: React.ReactNode;
};

function subscribe() {
	return () => {};
}

function getSnapshot() {
	return true;
}

function getServerSnapshot() {
	return false;
}

export function BodyPortal({ children }: BodyPortalProps) {
	const mounted = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	);

	if (!mounted) {
		return null;
	}

	return createPortal(children, document.body);
}
