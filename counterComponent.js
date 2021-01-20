(() => {
    class CounterComponent {

        constructor() {
            this.BTN_RESTART = "btnReiniciar"
            this.ID_COUNTER = "contador"
            this.COUNTER_VALUE = 100
            this.INTERVAL = 10
            this.start()
        }

        prepareCounterProxy() {
            const handler = {
                set: (currentContext, propertyKey, newValue) => {
                    if (!currentContext.value) {
                        currentContext.stopFn()
                    }

                    currentContext[propertyKey] = newValue
                    return true
                }
            }

            const counter = new Proxy({
                value: this.COUNTER_VALUE,
                stopFn: () => { }
            }, handler)

            return counter

        }

        updateText = ({ counterElement, counter }) => () => {
            const identifierText = '$$counter'
            const text = `Começando em <strong>${identifierText}</strong> segundos...`
            counterElement.innerHTML = text.replace(identifierText, counter.value--)
        }

        scheduleStopCounter({ counterElement, idIntervalo }) {

            return () => {
                clearInterval(idIntervalo)

                counterElement.innerHTML = ""
                this.desactiveButton(false)
            }

        }
        prepareButton(elementoBotao, iniciarFn) {
            elementoBotao.addEventListener('click', iniciarFn.bind(this))

            return (value = true) => {
                const atribute = 'disabled'

                elementoBotao.removeEventListener('click', iniciarFn.bind(this))

                if (value) {
                    elementoBotao.setAttribute(atribute, value)
                    return;
                }

                elementoBotao.removeAttribute(atribute)

            }
        }

        start() {
            console.log('Started!!')
            const counterElement = document.getElementById(this.ID_COUNTER)

            const counter = this.prepareCounterProxy()
            const argumentsOfFunction = {
                counterElement,
                counter
            }

            const fn = this.updateText(argumentsOfFunction)
            const idIntervalo = setInterval(fn, this.INTERVAL)

            {
                const elementoBotao = document.getElementById(this.BTN_RESTART)
                const desactiveButton = this.prepareButton(elementoBotao, this.start)
                desactiveButton()

                const argumentsOfFunction = { counterElement, idIntervalo }
                const stopCounter = this.scheduleStopCounter.apply({ desactiveButton }, [argumentsOfFunction])
                counter.stopFn = stopCounter
            }

        }
    }

    window.CounterComponent = CounterComponent
})()