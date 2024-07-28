type conditinoalyRenderType = (condition: boolean, renderWhenTrue: JSX.Element, renderWhenFalse?: JSX.Element) => JSX.Element;
export const conditinoalyRender: conditinoalyRenderType = (
    condition,
    renderWhenTrue,
    renderWhenFalse = <></>,
) => condition ? renderWhenTrue : renderWhenFalse;