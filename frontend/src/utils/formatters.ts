import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { RankTier, DebatePhase, SpeakerTurn } from '@/types';

/**
 * Format seconds to mm:ss
 */
export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(date: string): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
}

/**
 * Relative time (e.g., "3 phút trước")
 */
export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
}

/**
 * Rank tier display name
 */
export function getTierDisplay(tier: RankTier): { label: string; color: string } {
  const map: Record<RankTier, { label: string; color: string }> = {
    Novice: { label: 'Tân binh', color: '#6b7280' },
    Debater: { label: 'Debater', color: '#22c55e' },
    Advanced: { label: 'Nâng cao', color: '#3b82f6' },
    Expert: { label: 'Chuyên gia', color: '#8b5cf6' },
    Master: { label: 'Master', color: '#f59e0b' },
    GrandMaster: { label: 'Grand Master', color: '#ef4444' },
  };
  return map[tier];
}

/**
 * Phase display name (Vietnamese)
 */
export function getPhaseDisplay(phase: DebatePhase): string {
  const map: Record<DebatePhase, string> = {
    motion: 'Công bố chủ đề',
    prep_7: 'Chuẩn bị (7 phút)',
    speech: 'Phát biểu',
    cross_exam: 'Chất vấn',
    judge_feedback: 'BGK nhận xét',
    prep_1: 'Nghỉ (1 phút)',
    closing: 'Tổng kết',
    final_judging: 'Chấm điểm cuối',
    completed: 'Kết thúc',
  };
  return map[phase];
}

/**
 * Speaker turn display
 */
export function getSpeakerDisplay(turn: SpeakerTurn): string {
  const map: Record<SpeakerTurn, string> = {
    PRO_S1: 'Ủng hộ - Speaker 1',
    OPP_S1: 'Phản đối - Speaker 1',
    PRO_S2: 'Ủng hộ - Speaker 2',
    OPP_S2: 'Phản đối - Speaker 2',
    PRO_S3: 'Ủng hộ - Speaker 3',
    OPP_S3: 'Phản đối - Speaker 3',
  };
  return map[turn];
}
