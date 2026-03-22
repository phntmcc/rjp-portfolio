"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "cmdk";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { navigateWithTransition } from "@/components/navigation/transition-routing";
import { homeContent } from "@/content/home";

type CommandMenuContextValue = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

export function useCommandMenu() {
	const ctx = useContext(CommandMenuContext);
	if (!ctx) {
		throw new Error("useCommandMenu must be used within CommandMenuProvider");
	}
	return ctx;
}

export function CommandMenuProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<CommandMenuContext.Provider value={{ open, setOpen }}>
			{children}
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				label="Command menu"
				overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
				contentClassName="fixed left-1/2 top-[20%] z-50 w-[min(100%-2rem,480px)] -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#141414] p-0 shadow-2xl"
			>
				<Dialog.Title className="sr-only">Command menu</Dialog.Title>
				<div className="flex items-center gap-2 border-b border-white/10 px-3">
					<Search className="size-4 shrink-0 text-neutral-500" aria-hidden />
					<CommandInput
						placeholder="Jump to…"
						className="flex h-12 w-full bg-transparent py-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-500"
					/>
				</div>
				<CommandList className="max-h-[min(60vh,320px)] overflow-y-auto p-2">
					<CommandEmpty className="py-6 text-center text-sm text-neutral-500">
						No results.
					</CommandEmpty>
					<CommandGroup heading="Navigate">
						{homeContent.command.map((item) => (
							<CommandItem
								key={item.id}
								value={`${item.label} ${item.keywords ?? ""}`}
								keywords={[item.label, item.keywords ?? ""].filter(Boolean)}
								onSelect={() => {
									setOpen(false);
									if (item.href.startsWith("http")) {
										window.open(item.href, "_blank", "noopener,noreferrer");
										return;
									}
									if (item.href.startsWith("mailto:")) {
										window.location.href = item.href;
										return;
									}
									if (item.href.startsWith("/")) {
										navigateWithTransition(router, item.href);
										return;
									}
									if (item.href === "#") {
										if (pathname !== "/") {
											navigateWithTransition(router, "/");
											return;
										}
										window.scrollTo({ top: 0, behavior: "smooth" });
										return;
									}
									if (item.href.startsWith("#") && pathname !== "/") {
										navigateWithTransition(router, `/${item.href}`);
										return;
									}
									const id = item.href.replace(/^#/, "");
									if (!id) {
										window.scrollTo({ top: 0, behavior: "smooth" });
										return;
									}
									window.location.hash = item.href;
									document.getElementById(id)?.scrollIntoView({
										behavior: "smooth",
									});
								}}
								className="flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm text-neutral-200 aria-selected:bg-white/10 aria-selected:text-white"
							>
								{item.label}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</CommandMenuContext.Provider>
	);
}

export function CommandMenuTrigger({ className }: { className?: string }) {
	const { setOpen } = useCommandMenu();
	return (
		<button
			type="button"
			onClick={() => setOpen(true)}
			className={`cursor-pointer ${className ?? ""}`}
			aria-haspopup="dialog"
			aria-label="Open command menu"
		>
			<span className="flex items-center gap-2">
				<Search className="adaptive-contrast size-[14px]" aria-hidden />
				<span className="adaptive-contrast text-sm">Command Menu</span>
				<kbd className="adaptive-contrast rounded border border-white/25 bg-black/45 px-1.5 py-0.5 font-mono text-xs">
					⌘K
				</kbd>
			</span>
		</button>
	);
}
