import { LucideIcon } from "lucide-react";

export interface TestimonialProps {
	rating: number;
	quote: string;
	author: string;
	position: string;
	company: string;
	avatar: string;
	companyLogo: string;
}

export interface PricingPlanProps {
	name: string;
	price: string;
	features: string[];
	icon: string;
}

export interface FeatureCardProps {
	image: string;
	title: string;
	description: string;
}

export interface ContactInfoProps {
	icon: string;
	title: string;
	value: string;
	link?: boolean;
}

export interface SocialLinkProps {
	icon: string;
	platform: string;
}

export interface NavItemProps {
	label: string;
	href: string;
}

export interface ButtonProps {
	variant?: "primary" | "secondary";
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

export interface HeaderProps {
	onSignUpClick: () => void;
}

export interface HeroSectionProps {
	onGetStarted: () => void;
	onSchedule: () => void;
}

export interface NewsletterFormProps {
	onSubmit: (email: string) => void;
}

export interface FooterProps {
	onPrivacyClick: () => void;
	onTermsClick: () => void;
	onCookieSettingsClick: () => void;
}

export interface ContactItemProps {
	icon: string;
	title: string;
	content: string;
	isLink?: boolean;
}

export interface ContactSectionProps {
	title: string;
	subtitle: string;
	description: string;
	contactItems: ContactItemProps[];
}

export interface ButtonProps {
	children: React.ReactNode;
	variant?: "primary" | "secondary";
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
	type?: "button" | "submit";
}

export interface DividerProps {
	text: string;
}

export interface GoogleSignInButtonProps {
	onClick?: () => void;
	disabled?: boolean;
}

export interface SignInInputFieldProps {
	label: string;
	placeholder: string;
	type?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SocialButtonProps {
	icon: string;
	text: string;
	onClick?: () => void;
}

export interface InputFieldProps {
	label: string;
	type?: string;
	id: string;
	defaultValue?: string;
}

export interface SignInButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
}

export interface VideoCardProps {
	id: string;
	duration: string;
	userName?: string; // Optional, derived from User relation
	timeAgo?: string; // Calculated elsewhere (e.g., "2 hours ago")
	title?: string;
	totalViews: number; // Renamed from `views` to match Prisma
	comments: number; // Derived from Chat[] or similar
	shares: number; // Derived elsewhere
	thumbnailUrl?: string;
	userAvatarUrl?: string;
	onClick?: () => void;
	transcodeStatus?: VideoStatus;
	spaceId?: string;
	type?: VideoType;
	thumbnailStatus: VideoStatus;
}

export interface SectionProps {
	title: string;
	videos: VideoCardProps[];
}

export interface SidebarItemProps {
	icon: LucideIcon;
	label: string;
	isActive?: boolean;
	notificationCount?: number;
	link: string;
}

export interface SpaceProps {
	name: string;
	id: string;
	avatar: string;
}

export interface VideoStats {
	views: number;
	comments: number;
	likes: number;
}

export interface VideoMetadata {
	duration: string;
	author: {
		name: string;
		avatar: string;
	};
	timestamp: string;
	shared: boolean;
	title: string;
	stats: VideoStats;
}

export interface Folder {
	name: string;
	id: string;
	videoCount: number;
	workspaceId: string;
}

export interface Notification {
	id: string;
	title: string;
	content: string;
	type: NotifType;
	status: NotifStatus;
	createdAt: Date;
}

export enum NotifType {
	FIRST_VIEW = "FIRST_VIEW",
	COMMENT = "COMMENT",
	TRANSCRIPT_SUCCESS = "TRANSCRIPT_SUCCESS",
	TRANSCRIPT_FAILURE = "TRANSCRIPT_FAILURE",
	SHARE = "SHARE",
	WORKSPACE_REMOVE = "WORKSPACE_REMOVE",
	WORKSPACE_INVITATION = "WORKSPACE_INVITATION",
	WORKSPACE_DELETE = "WORKSPACE_DELETE",
	VIDEO_SHARE = "VIDEO_SHARE",
}

export enum NotifStatus {
	UNREAD = "UNREAD",
	READ = "READ",
	DISMISSED = "DISMISSED",
}

export interface Video {
	id: string;
	title: string;
	description?: string;
	createdAt: Date;
	userId: string;
	totalViews: number;
	uniqueViews: number;
	transcription?: string;
	duration: string;
	folderId?: string;
	workspaceId: string;
	spaceId?: string;

	processing: VideoStatus;
	transcodeStatus: VideoStatus;
	uploaded: VideoStatus;
	thumbnailStatus: VideoStatus;
	transcriptionStatus: VideoStatus;
	titleStatus: VideoStatus;
	descriptionStatus: VideoStatus;
	type: VideoType;
	liveStreamStatus: VideoStatus;

	userName: string;
	comments: number;
	views: number;
	shares: number;
	timeAgo: string;
	thumbnailUrl: string;
	userAvatarUrl: string;

	isPublic?: boolean;

	User?: {
		fullName?: string | null;
		image?: string | null;
	};

	watchLater: { id: string } | null;
}

export type VideoStatus = "PENDING" | "SUCCESS" | "FAILED" | "PROCESSING";
export type VideoType = "VOD" | "LIVE";

export interface IChatHierarchical {
	id: string;
	name: string;
	image?: string;
	message: string;
	replies: IChatHierarchical[];
}

export interface IChatFlat {
	id: string;
	user: {
		name: string;
		id: string;
	};
	image?: string;
	message: string;
	repliedTo: IChatFlat | null;
	videoId?: string;
}

export interface SubscriptionPlan {
	id: string;
	type: "free" | "paid";
	planId?: string;
	name: string;
	price: number;
	interval?: number;
	period?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
	maxRecordingDuration: number;
	hasAiFeatures: boolean;
	allowsCustomBranding: boolean;
	hasAdvancedEditing: boolean;
	maxMembers?: number;
	maxVideoCount?: number;
	maxWorkspaces?: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface SubscriptionData {
	status: string;
	shortUrl: string;
	subscriptionType: string;
	amount: number;
}

export interface ActivePlan extends SubscriptionPlan {
	startDate: Date;
	endDate: Date;
	chargeAt: Date;
	remainingCount: number;
	totalCount: number;
	cancelledAt?: Date | null;
	amount: number;
	shortUrl: string;
	status: string;
	currentEnd: Date;
	currentStart: Date;
}

interface Uploader {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	user_view_type: string;
	site_admin: boolean;
}

export interface Asset {
	url: string;
	id: number;
	node_id: string;
	name: string;
	label: string;
	uploader: Uploader;
	content_type: string;
	state: string;
	size: number;
	download_count: number;
	created_at: string;
	updated_at: string;
	browser_download_url: string;
}

export interface GitHubRelease {
	url: string;
	assets_url: string;
	upload_url: string;
	html_url: string;
	id: number;
	node_id: string;
	tag_name: string;
	target_commitish: string;
	name: string;
	draft: boolean;
	prerelease: boolean;
	created_at: string;
	published_at: string;
	assets: Asset[];
	tarball_url: string;
	zipball_url: string;
	body: string;
}

export interface ErrorResponse {
	error?: string;
	message: string;
}

// Interface for subscription response
export interface SubscriptionResponse {
	id?: string;
	userId: string;
	planId: string;
	status: string;
	razorpayKeyId: string;
	shortUrl: string;
	subscriptionType: string;
	amount: number;
	[key: string]: any;
}
