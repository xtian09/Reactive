import { Job } from "./Type";

const queue: (Job | null)[] = [];
const p = Promise.resolve();

let isFlushing = false;
let isFlushPending = false;

export function nextTick(fn?: () => void): Promise<void> {
  return fn ? p.then(fn) : p;
}

export function queueJob(job: Job) {
  if (!queue.includes(job)) {
    queue.push(job);
    queueFlush();
  }
}

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    nextTick(flushJobs);
  }
}

function flushJobs() {
  isFlushPending = false;
  isFlushing = true;
  let job;
  while ((job = queue.shift()) !== undefined) {
    if (job === null) {
      continue;
    }
    job();
  }
  isFlushing = false;
  if (queue.length) {
    flushJobs();
  }
}
