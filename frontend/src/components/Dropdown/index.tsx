import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
  ComponentProps,
  MouseEvent,
} from "react";
import { CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";
import { useFloating, offset, autoUpdate, Placement } from "@floating-ui/react-dom";
import { clickOutside } from "../../utils/index";

import styles from "./DropDown.module.scss";

type DropDownProps = {
  selector: string;
  children?: ReactNode;
  size?: "auto";
  placement?: Placement;
} & ComponentProps<"div">;

type DropDownContextType = {
  close: () => void;
};

const DropDownContext = createContext<DropDownContextType | null>(null);

const DropDown = ({
  placement = "bottom-start",
  className,
  selector,
  children,
  size,
  ...props
}: DropDownProps) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [show, setShow] = useState(false);

  const {
    x,
    y,
    refs,
    strategy,
  } = useFloating({
    placement,
    middleware: [offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const open = () => setShow(true);
  const close = () => setShow(false);

  useEffect(() => {
    if (selector.length === 0) return;

    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;

    element.onclick = open;
    setReferenceElement(element);
    refs.setReference(element);
  }, [selector, refs]);

  const onEntered = (element: HTMLElement) => {
    if (!element) return;

    clickOutside({
      ref: element,
      onClose: close,
      doNotClose: (event) => {
        if (!referenceElement) return false;
        return referenceElement.contains(event);
      },
    });
  };

  return createPortal(
    <CSSTransition
      in={show}
      timeout={200}
      unmountOnExit
      classNames={{
        enterActive: styles.enter,
        exitActive: styles.exit,
      }}
      onEntered={onEntered}
    >
      <DropDownContext.Provider value={{ close }}>
        <div
          ref={refs.setFloating} className={`${styles.container} ${className || ""}`.trim()}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            ...(size === "auto" && referenceElement && {
              width: referenceElement.getBoundingClientRect().width,
            }),
          }}
          {...props}
        >
          <div className={styles.menu}>{children}</div>
        </div>
      </DropDownContext.Provider>
    </CSSTransition>,
    document.body
  );
};

type DropDownItemProps = {
  children?: ReactNode;
  onClick?: (event: MouseEvent) => void;
  className?: string;
} & ComponentProps<"button">;

export const Item = ({
  children,
  onClick,
  className,
  ...props
}: DropDownItemProps) => {
  const { close } = useContext(DropDownContext) as DropDownContextType;

  const handleClick = (event: MouseEvent): void => {
    close();
    if (typeof onClick === "function") onClick(event);
  };

  return (
    <button
      className={`${styles.item} ${className || ""}`.trim()}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

DropDown.Item = Item;

export default DropDown;
