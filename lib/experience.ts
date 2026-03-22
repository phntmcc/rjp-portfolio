export function yearsOfExperience(experienceStartYear: number): number {
	const currentYear = new Date().getFullYear();
	return Math.max(0, currentYear - experienceStartYear);
}

export function formatExperienceDuration(experienceStartYear: number): string {
	const years = yearsOfExperience(experienceStartYear);
	if (years <= 0) return "Less than 1 year";
	if (years === 1) return "1 year";
	return `${years} years`;
}
