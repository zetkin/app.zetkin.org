function App() {
  return <h1> Hello from the petition! </h1>;
}

export default App;

// import EmptyOverview from 'features/petitions/components/EmptyOverview';
// import PetitionUnlinkedCard from 'features/petitions/components/PetitionUnlinkedCard';
// import PetitionURLCard from 'features/petitions/components/PetitionURLCard';
// import SubmissionChartCard from 'features/petitions/components/SubmissionChartCard';
// import usePetition from 'features/petitions/hooks/usePetition';
// import usePetitionElements from 'features/petitions/hooks/usePetitionElements';
// import usePetitionState, {
//   PetitionState,
// } from 'features/petitions/hooks/usePetitionState';
// import PetitionLayout from 'features/petitions/layouts/PetitionLayout';
// import { getPetitionProjectId } from 'features/petitions/utils/getPetitionUrl';

// function getSurveyProjectId(petition: ZetkinPetition | null, orgId: number) {
//   if (petition) {
//     if (petition.organization?.id !== orgId) {
//       return 'shared';
//     }
//     return petition.project?.id ?? 'standalone';
//   } else {
//     return '';
//   }
// }

// export const getServerSideProps: GetServerSideProps = scaffold(
//   async (ctx) => {
//     const { orgId, projectId, petitionId } = ctx.params!;

//     try {
//       const client = new BackendApiClient(ctx.req.headers);

//       const data = await client.get<ZetkinPetition>(
//         `/api/orgs/${orgId}/petitions/${petitionId}`
//       );

//       const actualProject = getPetitionProjectId(
//         data,
//         parseInt(orgId as string)
//       ).toString();

//       if (actualProject !== projectId) {
//         return { notFound: true };
//       }
//     } catch (error) {
//       return { notFound: true };
//     }

//     return {
//       props: {
//         projectId,
//         orgId,
//         petitionId,
//       },
//     };
//   },
//   {
//     authLevelRequired: 2,
//     localeScope: ['layout.organize.petitions', 'pages.organizePetition'],
//   }
// );

// interface PetitionPageProps {
//   projectId: string;
//   orgId: string;
//   petitionId: string;
// }

// const PetitionPage: PageWithLayout<PetitionPageProps> = ({
//   projectId,
//   orgId,
//   petitionId,
// }) => {
//   const onServer = useServerSide();
//   const { data: petition } = usePetition(parseInt(orgId), parseInt(petitionId));
//   const state = usePetitionState(parseInt(orgId), parseInt(petitionId));
//   const { petitionIsEmpty } = usePetitionElements(
//     parseInt(orgId),
//     parseInt(petitionId)
//   );

//   if (onServer) return null;

//   const isOpen = state === PetitionState.PUBLISHED;

//   if (!petition) return null;

//   return (
//     <>
//       <Head>
//         <title>{petition?.title}</title>
//       </Head>
//       <Box>
//         {petitionIsEmpty ? (
//           <EmptyOverview
//             projectId={projectId}
//             orgId={orgId}
//             petitionId={petitionId}
//           />
//         ) : (
//           <Grid container spacing={2}>
//             <Grid size={{ md: 8 }}>
//               <SubmissionChartCard
//                 orgId={parseInt(orgId)}
//                 petitionId={parseInt(petitionId)}
//               />
//             </Grid>
//             <Grid size={{ md: 4 }}>
//               <PetitionURLCard
//                 isOpen={isOpen}
//                 orgId={petition.organization.id.toString()}
//                 petitionId={petitionId}
//               />
//               <PetitionUnlinkedCard
//                 projectId={
//                   projectId !== 'shared' && projectId !== 'standalone'
//                     ? parseInt(projectId)
//                     : projectId
//                 }
//                 orgId={parseInt(orgId)}
//                 petitionId={parseInt(petitionId)}
//               />
//             </Grid>
//           </Grid>
//         )}
//       </Box>
//     </>
//   );
// };

// PetitionPage.getLayout = function getLayout(page, props) {
//   return (
//     <PetitionLayout
//       projectId={props.projectId}
//       orgId={props.orgId}
//       petitionId={props.petitionId}
//     >
//       {page}
//     </PetitionLayout>
//   );
// };

// export default PetitionPage;
