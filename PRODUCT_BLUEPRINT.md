# Today – A Mindful Daily Productivity Ecosystem

## 1) Product Vision
Today is a daily planning app built around a **fresh-start day loop** instead of an infinite backlog. It combines intentional planning, adaptive execution support, end-of-day reflection, and a searchable personal archive.

### Design principles
- **Daily reset:** Each day starts clean.
- **Mindful productivity:** Focus on clarity, not pressure.
- **Reflection over raw output:** Capture how the day felt, not just what got done.
- **Private by default:** User data belongs to the user.

---

## 2) User Journey

## Morning Ritual (Input Phase)
1. At a user-defined time, the app enters **Ritual Mode**.
2. User is guided to set today’s intentions.
3. If rushing, user can enter one **Non-Negotiable** task to unlock the app (**Express Mode**).
4. App schedules a follow-up reminder to complete full planning.
5. Optional calendar sync pulls meetings as **blocked time**, visually separated from personal tasks.

### Acceptance criteria
- Ritual Mode triggers reliably at the configured time.
- Express Mode unlocks after one required task.
- A follow-up nudge is sent if full list remains incomplete.
- Calendar blocks are import-only to the schedule layer, not the core task list.

---

## Execution & Intelligence

### Prioritization
- User can manually reorder tasks.
- AI can suggest order using completion-history patterns (e.g., deep work first if historically completed best in morning).

### Adaptive notifications
- Notifications are nudge-based and context-sensitive.
- Completing a task immediately cancels pending nudges for that task.

### Deep Work Shield
- While a focus session is active, non-essential phone notifications are muted.
- Shield can be task-bound and duration-based.

### Acceptance criteria
- Task completion triggers instant notification cancellation.
- AI-suggested order is explainable in simple language.
- Focus mode has clear on/off state and emergency bypass.

---

## Review & Rollover Logic

### Three-Strike Rule
- A task can be rolled over up to **3 times within a 7-day window**.
- On third strike, the **Review Gate** is mandatory before it can persist.

### Review Gate options
1. Break task into subtasks.
2. Delete task.
3. Schedule task to a specific future date.

### Celebration Engine
- If all active tasks are completed, user gets:
  - “Daily Win” message
  - Shareable visual summary card

### Acceptance criteria
- Weekly strike count is deterministic and auditable.
- Third strike cannot be bypassed.
- Completion state generates Daily Win exactly once per day.

---

## Archive: The Digital Journal

### Visual timeline
- Each day becomes a **Memory Card** with:
  - Date
  - Task list snapshot
  - Completion rate
  - Notes
  - One-word reflection

### One-Word Reflection (required)
- User must submit a single word before day closure.

### AI monthly insights
- Monthly narrative summary focused on growth language.
- Includes trends, not judgment.

### Acceptance criteria
- Archive is searchable by date, keyword, and reflection word.
- Daily close flow enforces one-word reflection.
- Insight generation runs monthly and remains user-reviewable.

---

## 3) Visual Identity & UX

### Circadian UI
Theme auto-shifts by local time:
- **Morning:** energetic gold/yellow
- **Daylight:** high-contrast white/blue
- **Night:** deep purple/midnight navy

### Privacy and sharing
- No social feed.
- Optional external sharing of Daily Win cards.

### Accessibility requirements
- WCAG-friendly contrast in all themes.
- Reduced-motion option for transitions.
- Notification and haptic preferences configurable.

---

## 4) Technical Blueprint

## Architecture (local-first)
- **Client-first datastore** (encrypted on device).
- **Sync layer** optional for backup and multi-device continuity.
- **Event log model** for task lifecycle and strike tracking.

### Suggested domain model
- `UserPreferences`
- `DailyPlan`
- `Task`
- `TaskEvent` (created, completed, rolled_over, split, deleted, deferred)
- `ReflectionEntry`
- `MemoryCard`
- `ProductivityPattern`

### Core services
- `RitualSchedulerService`
- `CalendarSyncService` (Google/Outlook adapters)
- `NotificationOrchestrator`
- `FocusShieldService`
- `RolloverPolicyEngine`
- `ArchiveIndexer`
- `InsightsNarrator`

---

## 5) Algorithm & Logic Notes

### AI prioritization signal examples
- Time-of-day completion rate by category
- Estimated task duration vs remaining energy window
- Historical deferral likelihood
- Context (meeting-heavy vs open-focus day)

### Rollover strike pseudocode
```text
if task.isRollover:
  strikes = countRolloverEvents(task, window=7d)
  if strikes < 3:
    allowRollover()
  else:
    openReviewGate(task)
```

### Notification cancellation rule
```text
onTaskCompleted(taskId):
  cancelAllScheduledNudges(taskId)
  stopFocusLinkedReminders(taskId)
```

---

## 6) Milestone Delivery Plan

### Phase 1 — MVP
- Ritual Mode + Express Mode
- Core task list + complete/cancel nudges
- Three-strike rollover + Review Gate
- Basic Memory Card archive

### Phase 2 — Intelligence
- AI ordering suggestions
- Pattern recognition backend
- Monthly narrative insights

### Phase 3 — Polished experience
- Circadian UI refinements
- Deep Work Shield enhancements
- Daily Win card templates + export options

---

## 7) Easter Egg (7-Day Streak)

### Feature: “Aurora Unlock”
When user completes **7 consecutive full-list days**, trigger a hidden celebration:
- Screen darkens briefly and an aurora gradient animation appears.
- A rotating quote appears from a “quiet wins” quote set.
- A subtle chime plays (optional; obeys sound settings).
- Unlocks a new Memory Card badge: **“Seven Suns”**.

### Example quote
> “Consistency is what turns intention into identity.”

### Guardrails
- Fires once per streak milestone (7, 30, 100...).
- Fully disable-able in accessibility settings.
- No public posting by default.

