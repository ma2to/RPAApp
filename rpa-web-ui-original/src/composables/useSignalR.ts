// composables/useSignalR.ts
import { ref, onUnmounted } from 'vue'
import * as signalR from '@microsoft/signalr'

export interface SignalROptions {
  hubUrl?: string
  autoReconnect?: boolean
}

export function useSignalR(options: SignalROptions = {}) {
  const hubUrl = options.hubUrl || '/gridhub'
  const autoReconnect = options.autoReconnect !== false

  const connection = ref<signalR.HubConnection | null>(null)
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const connectionError = ref<Error | null>(null)

  async function start() {
    if (connection.value || isConnecting.value) {
      console.log('SignalR: Already connected or connecting')
      return
    }

    isConnecting.value = true
    connectionError.value = null

    try {
      const builder = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling
        })

      if (autoReconnect) {
        builder.withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0ms, 2s, 10s, 30s, then 30s
            if (retryContext.previousRetryCount === 0) return 0
            if (retryContext.previousRetryCount === 1) return 2000
            if (retryContext.previousRetryCount === 2) return 10000
            return 30000
          }
        })
      }

      connection.value = builder.build()

      // Connection lifecycle events
      connection.value.onclose((error) => {
        isConnected.value = false
        if (error) {
          console.error('SignalR connection closed with error:', error)
          connectionError.value = error
        } else {
          console.log('SignalR connection closed')
        }
      })

      connection.value.onreconnecting((error) => {
        isConnected.value = false
        console.warn('SignalR reconnecting...', error)
      })

      connection.value.onreconnected((connectionId) => {
        isConnected.value = true
        connectionError.value = null
        console.log('SignalR reconnected:', connectionId)
      })

      // Start connection
      await connection.value.start()
      isConnected.value = true
      console.log('SignalR connected successfully')
    } catch (error) {
      console.error('SignalR connection failed:', error)
      connectionError.value = error as Error
      connection.value = null
    } finally {
      isConnecting.value = false
    }
  }

  async function stop() {
    if (connection.value) {
      try {
        await connection.value.stop()
        console.log('SignalR connection stopped')
      } catch (error) {
        console.error('Error stopping SignalR connection:', error)
      } finally {
        connection.value = null
        isConnected.value = false
      }
    }
  }

  function on<T = any>(eventName: string, handler: (data: T) => void) {
    if (!connection.value) {
      console.warn(`Cannot register handler for '${eventName}': connection not initialized`)
      return
    }
    connection.value.on(eventName, handler)
  }

  function off(eventName: string, handler?: (...args: any[]) => void) {
    if (!connection.value) return
    if (handler) {
      connection.value.off(eventName, handler)
    } else {
      connection.value.off(eventName)
    }
  }

  async function invoke<T = any>(methodName: string, ...args: any[]): Promise<T | void> {
    if (!connection.value || !isConnected.value) {
      console.error(`Cannot invoke '${methodName}': not connected`)
      return
    }

    try {
      return await connection.value.invoke<T>(methodName, ...args)
    } catch (error) {
      console.error(`Error invoking '${methodName}':`, error)
      throw error
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stop()
  })

  return {
    connection,
    isConnected,
    isConnecting,
    connectionError,
    start,
    stop,
    on,
    off,
    invoke
  }
}
