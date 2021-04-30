let seqNum = 0

function getSeqNum() {
  return ++seqNum
}

function generateEventId() {
  return (
    Date.now().toString(16) +
    '_' +
    getSeqNum().toString(16)
  )
}

export const generateTracingInfo = () => {
  const TCB_SEQID = process.env.TCB_SEQID || ''
  const eventId = generateEventId()
  const seqId = TCB_SEQID ? `${TCB_SEQID}-${eventId}` : eventId

  return { eventId, seqId }
}

