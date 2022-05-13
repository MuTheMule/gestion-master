--
-- PostgreSQL database dump
--

-- Dumped from database version 13.6
-- Dumped by pg_dump version 13.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id integer NOT NULL,
    designation character varying(255),
    stock_price double precision,
    unit_price double precision,
    "timestamp" timestamp without time zone
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: receipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receipt (
    id integer NOT NULL,
    person character varying(255),
    debt double precision,
    "timestamp" timestamp without time zone
);


ALTER TABLE public.receipt OWNER TO postgres;

--
-- Name: receipt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.receipt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.receipt_id_seq OWNER TO postgres;

--
-- Name: receipt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.receipt_id_seq OWNED BY public.receipt.id;


--
-- Name: transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction (
    id integer NOT NULL,
    unit_code character varying(255),
    receipt_id integer,
    quantity integer,
    status boolean,
    stock_price double precision,
    unit_price double precision
);


ALTER TABLE public.transaction OWNER TO postgres;

--
-- Name: transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_id_seq OWNER TO postgres;

--
-- Name: transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_id_seq OWNED BY public.transaction.id;


--
-- Name: unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit (
    barcode character varying NOT NULL,
    product_id integer,
    property character varying(255),
    quantity integer,
    "timestamp" timestamp without time zone
);


ALTER TABLE public.unit OWNER TO postgres;

--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Name: receipt id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt ALTER COLUMN id SET DEFAULT nextval('public.receipt_id_seq'::regclass);


--
-- Name: transaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction ALTER COLUMN id SET DEFAULT nextval('public.transaction_id_seq'::regclass);


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, designation, stock_price, unit_price, "timestamp") FROM stdin;
1	yaourt	15	25	2022-05-11 11:17:41.713061
2	lait	50	60	2022-05-11 12:51:03.605751
\.


--
-- Data for Name: receipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receipt (id, person, debt, "timestamp") FROM stdin;
1	hatem tazir	10000	2022-05-11 12:16:07.52314
2	lmour rider	20000	2022-05-11 12:16:26.896023
3	nasro	0	2022-05-11 12:19:36.378221
4		0	2022-05-11 12:19:48.319738
5	nasro	100	2022-05-10 00:00:00
\.


--
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction (id, unit_code, receipt_id, quantity, status, stock_price, unit_price) FROM stdin;
1	6130552001225	1	50	t	15	25
2	6130552001225	1	50	t	15	25
3	6130552001224	2	10	t	15	25
4	6130552001224	3	15	t	15	25
6	6130552001223	\N	3	f	15	25
7	6130552001223	\N	3	f	15	25
9	6130552001223	\N	1	f	15	25
8	6251592011019	5	6	f	50	60
\.


--
-- Data for Name: unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit (barcode, product_id, property, quantity, "timestamp") FROM stdin;
6130552001225	1	gout miel	60	2022-05-11 11:20:28.057781
6130552001224	1	gout fraise	25	2022-05-11 11:21:11.66692
6130552001223	1	gout abricot	40	2022-05-11 11:21:50.988885
6251592011019	2	entier	10	2022-05-11 12:53:53.443505
\.


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 8, true);


--
-- Name: receipt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receipt_id_seq', 5, true);


--
-- Name: transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_id_seq', 9, true);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: receipt receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_pkey PRIMARY KEY (id);


--
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);


--
-- Name: unit unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_pkey PRIMARY KEY (barcode);


--
-- Name: transaction transaction_receipt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_receipt_id_fkey FOREIGN KEY (receipt_id) REFERENCES public.receipt(id);


--
-- Name: transaction transaction_unit_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_unit_code_fkey FOREIGN KEY (unit_code) REFERENCES public.unit(barcode);


--
-- Name: unit unit_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- PostgreSQL database dump complete
--

