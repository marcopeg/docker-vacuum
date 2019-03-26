
const loop = () => {
    console.log('loop')
    const next = () => setTimeout(loop, 1000)

    next()
}

// Start interface
export const start = loop
